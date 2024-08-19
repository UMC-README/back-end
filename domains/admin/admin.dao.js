import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getDate, getToday, isInvalidDate, getNow } from "../../utils/date.js";
import {
  createRoomsSQL,
  userRoomSQL,
  updateRoomsSQL,
  deleteRoomsSQL,
  createPostSQL,
  getMemberCountSQL,
  quizAnswerSQL,
  createPostImgSQL,
  updatePostSQL,
  deletePostImgSQL,
  deletePostSQL,
  unreadUserListSQL,
  userListNameSQL,
  userListSQL,
  userProfileSQL,
  userInviteSQL,
  checkUserInRoomSQL,
  deleteUserSQL,
  imposePenaltyByPostSQL,
  initializeSubmitByPostSQL,
  getPostsBeforeEndDate,
  getPostCountSQL,
  userSubmitSQL,
  getSubmitStateSQL,
  userRequestAcceptSQL,
  userRequestRejectSQL,
  getRoomSQL,
  getAlluserRoomSQL,
  decreaseUnreadCountOneBySubmitId,
  getPostSQL,
} from "./admin.sql.js";

import { updateUnreadCountByRoom } from "../room/room.sql.js";

import schedule from "node-schedule";

export const createRoomsDao = async (body, userId, roomInviteUrl) => {
  try {
    if (body.max_penalty > 10) throw new Error("패널티는 최대 10개까지만 생성이 가능합니다.");
    const conn = await pool.getConnection();
    const [result] = await conn.query(createRoomsSQL, [
      userId,
      body.room_image,
      body.admin_nickname,
      body.room_name,
      body.room_password,
      roomInviteUrl,
      body.max_penalty,
    ]);
    const roomId = result.insertId; // 생성된 roomId 가져오기

    // user-room 연결
    await conn.query(userRoomSQL, [userId, roomId, body.admin_nickname]);

    conn.release();
    return {
      roomId: roomId,
      roomImage: body.room_image,
      adminNickname: body.admin_nickname,
      roomName: body.room_name,
      roomPassword: body.room_password,
      maxPenalty: body.max_penalty,
      roomInviteUrl,
    };
  } catch (error) {
    console.error("공지방 생성하기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updateRoomsDao = async (body, roomId) => {
  try {
    if (body.max_penalty > 10) throw new Error("패널티는 최대 10개까지만 생성이 가능합니다.");
    const conn = await pool.getConnection();
    await conn.query(updateRoomsSQL, [
      body.room_image,
      body.admin_nickname,
      body.room_name,
      body.room_password,
      body.max_penalty,
      roomId,
    ]);
    conn.release();
    return { isFixed: true };
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getRoomsDao = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [[{ id }]] = await conn.query(getAlluserRoomSQL, userId);
    const isUsersRoom = id.split(",").includes(String(roomId));
    if (!isUsersRoom) {
      return -1;
    }
    const [roomResponse] = await conn.query(getRoomSQL, roomId);
    conn.release();
    return roomResponse[0];
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteRoomsDao = async (roomId) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(deleteRoomsSQL, roomId);
    return true;
  } catch (error) {
    console.error("공지방 삭제하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const createPostDao = async (body, userId) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 특정 공지방의 전체 멤버 수 카운트
    const [memberCountRows] = await conn.query(getMemberCountSQL, [body.room_id]);
    const initialUnreadCount = memberCountRows[0].user_count - 1;

    const quizAnswer = body.type === "QUIZ" ? body.quiz_answer : null;

    const startDate = `${body.start_date} 00:00`;
    const endDate = `${body.end_date} 23:59`;

    if (isInvalidDate(body.start_date, body.end_date)) return -1;
    if (getDate(startDate) < getToday()) return -2;
    if (getDate(endDate) <= getDate(startDate)) return -3;

    const [postResult] = await conn.query(createPostSQL, [
      body.room_id,
      body.type,
      body.title,
      body.content,
      startDate,
      endDate,
      body.question,
      quizAnswer,
      initialUnreadCount, // unread_count
      userId,
    ]);
    const newPostId = postResult.insertId;
    await conn.query(quizAnswerSQL, [quizAnswer, newPostId]);

    body.imgURLs.forEach((url) => {
      conn.query(createPostImgSQL, [url, newPostId], (error) => {
        if (error) {
          throw error;
        }
      });
    });
    await conn.commit(); // 트랜잭션 커밋(DB 반영)

    return {
      newPostId: newPostId, // 생성된 공지글 ID
      postType: body.type,
      postTitle: body.title,
      postContent: body.content,
      imgURLs: body.imgURLs,
      startDate,
      endDate,
      question: body.question,
      quizAnswer: body.quiz_answer,
    };
  } catch (error) {
    await conn.rollback(); // 오류 발생 시 롤백
    console.error("공지글 생성 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getPostDAO = async (postId, userId) => {
  const conn = await pool.getConnection();
  try {
    const [post] = await conn.query(getPostSQL, postId);
    if (!post.length) return -1;
    if (post[0].admin_id !== userId) return -2;
    conn.release();
    return post[0];
  } catch (error) {
    conn.release();
    console.error("admin 공지글 조회하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updatePostDao = async (body, postId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(updatePostSQL, [
      body.postTitle,
      body.postContent,
      body.endDate,
      body.question,
      body.quizAnswer, 
      postId
    ]);
    // 추가할 이미지
    for (const url of body.addImgURLs) {
      await conn.query(createPostImgSQL, [url, postId]);
    }
    // 삭제할 이미지
    if (body.deleteImgURLs) {
      for (const url of body.deleteImgURLs) {
        await conn.query(deletePostImgSQL, [postId, url]);
      }
    }
    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    console.error("공지글 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deletePostDao = async (postId) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(deletePostSQL, postId);
    return { deletedPostId: postId };
  } catch (error) {
    console.error("공지글 삭제하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const unreadUserListDao = async (postId) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.query(unreadUserListSQL, [postId]);
    console.log(users);

    if (users.length == 0) {
      conn.release();
      return null;
    }
    conn.release();
    return users;
  } catch (error) {
    console.error("미확인 유저 조회 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const userListDao = async (nickname, roomId) => {
  try {
    const conn = await pool.getConnection();
    let userListSQLQuery,
      params = [];

    if (nickname && nickname.trim() !== "") {
      // nickname 유효성 검사
      userListSQLQuery = userListNameSQL;
      params = [nickname, roomId];
    } else {
      userListSQLQuery = userListSQL; // 모든 유저 조회 쿼리
      params = [roomId];
    }

    const [result] = await conn.query(userListSQLQuery, params);
    conn.release();
    return result;
  } catch (error) {
    console.log("User 검색 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const userProfileDao = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(userProfileSQL, [userId, roomId]);
    conn.release();
    return result[0];
  } catch (error) {
    console.log("User 프로필 조회 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const userInviteDao = async (roomId) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(userInviteSQL, roomId);
    conn.release();
    return result[0];
  } catch (error) {
    console.log("초대 관련 공지방 정보 조회 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteUserDao = async (body) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [checkUser] = await conn.query(checkUserInRoomSQL, [body.userId, body.roomId]);
    if (!checkUser.length) {
      await conn.rollback();
      conn.release();
      return -1;
    }
    await conn.query(deleteUserSQL, [body.userId, body.roomId]);
    await conn.query(updateUnreadCountByRoom, body.roomId);

    await conn.commit();
    conn.release();
    return "유저 강퇴에 성공하였습니다.";
  } catch (error) {
    console.log("유저 강퇴하기 에러");
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const initializeSubmitByPostDAO = async (postId) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(initializeSubmitByPostSQL, [postId]);
    console.log("제출 모두 초기화 완료");
    conn.release();
    return true;
  } catch (error) {
    console.log("공지글에 모든 제출 초기화 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const reserveImposePenaltyByPostDAO = async (postId, endDate) => {
  try {
    const conn = await pool.getConnection();
    const date = new Date(endDate);
    const jobName = `#${postId}PostPenalty`;
    console.log(date.toString());
    schedule.scheduleJob(jobName, date, async function () {
      await conn.query(imposePenaltyByPostSQL, [postId]);
      console.log(postId, "번 공지글 페널티 부여 실행");
    });
    console.log(postId, "번 공지글 페널티 부여 예약 성공");
    const jobList = schedule.scheduledJobs;
    console.log(jobList);
    conn.release();
    return true;
  } catch (error) {
    console.log("페널티 부여 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const reserveImposePenaltyForEveryValidPostDAO = async () => {
  try {
    const conn = await pool.getConnection();
    const [posts] = await conn.query(getPostsBeforeEndDate);

    posts.forEach((post) => {
      const postId = post.id;
      const date = new Date(post.end_date);
      const jobName = `#${postId}PostPenalty`;
      console.log(postId, "번 공지글 마감기한: ", date.toString());
      schedule.scheduleJob(jobName, date, async function () {
        await conn.query(imposePenaltyByPostSQL, [postId]);
        console.log(postId, "번 공지글 페널티 부여 실행");
      });
    });
    console.log("마감기한이 지나지 않은 모든 공지글에 대한 페널티 부여 예약 성공");
    const jobList = schedule.scheduledJobs;
    console.log(jobList);
    conn.release();
    return true;
  } catch (error) {
    console.log("마감기한이 지나지 않은 모든 공지글에 대한 페널티 부여 예약 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const cancelImposePenaltyByPostDAO = async (postId) => {
  try {
    const jobName = `#${postId}PostPenalty`;
    schedule.cancelJob(jobName);
    console.log(postId, "번 공지글 페널티 부여 예약 취소 완료");
    const jobList = schedule.scheduledJobs;
    console.log(jobList);
    return true;
  } catch (error) {
    console.log("기존 페널티 부여 일정 취소 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

// 확인 요청 내역 공지글 목록 조회
export const getPostListDao = async (roomId) => {
  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(getPostCountSQL);
    const countPost = rows[0]?.count || 0;
    if (countPost === 0) {
      return { message: "공지가 없습니다." };
    }

    const [postList] = await conn.query(userSubmitSQL, roomId);
    conn.release();

    return postList;
  } catch (error) {
    console.log("확인 요청 내역 공지글 목록 조회 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

// 하나의 공지글에 대한 확인 요청 내역 (대기 or 승인 완료) 조회
export const getSubmitListDao = async (roomId, postId, state) => {
  try {
    const conn = await pool.getConnection();

    const [submitList] = await conn.query(getSubmitStateSQL, [roomId, postId, state]);

    conn.release();

    return submitList.map((submit) => ({
      submitId: submit.submit_id,
      profileImage: submit.profile_image,
      nickname: submit.nickname,
      images: submit.images ? submit.images.split(",") : [],
      content: submit.content,
      submitState: submit.submit_state,
    }));
  } catch (error) {
    console.log("하나의 공지글에 대한 확인 요청 내역 (대기 or 승인 완료) 조회 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const userRequestDao = async (submitId, body) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    if (body.type === "accept") {
      await conn.query(userRequestAcceptSQL, submitId);
      await conn.query(decreaseUnreadCountOneBySubmitId, submitId);
    } else if (body.type === "reject") await conn.query(userRequestRejectSQL, submitId);
    else {
      await conn.rollback();
      throw new Error("유효하지 않은 type입니다.");
    }

    await conn.commit();
    conn.release();
    return "요청 수행에 성공하였습니다.";
  } catch (error) {
    console.log("수락/거절 요청 수행 error");
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
