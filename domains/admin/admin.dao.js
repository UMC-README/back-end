import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getDate, getToday, isInvalidDate } from "../../utils/date.js";
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
} from "./admin.sql.js";

import schedule from "node-schedule";

export const createRoomsDao = async (body, userId, roomInviteUrl) => {
  try {
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
      roomId: roomId, // 생성된 방 Id 반환
      roomImage: body.room_image,
      adminNickname: body.admin_nickname,
      roomName: body.room_name,
      roomPassword: body.room_password,
      maxPenalty: body.max_penalty,
      roomInviteUrl,
    };
  } catch (error) {
    console.error("공지방 생성하기 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updateRoomsDao = async (body) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(updateRoomsSQL, [
      body.room_image,
      body.admin_nickname,
      body.room_name,
      body.room_password,
      body.max_penalty,
      body.id,
    ]);
    conn.release();
    return {
      roomImage: body.room_image,
      adminNickname: body.admin_nickname,
      roomName: body.room_name,
      passWord: body.room_password,
      maxPenalty: body.max_penalty,
    };
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteRoomsDao = async (body) => {
  try {
    const conn = await pool.getConnection();
    const { roomId } = body;
    await conn.query(deleteRoomsSQL, roomId);
    return { deletedRoomId: roomId };
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
    const endDate = `${body.end_date} 13:50`;

    if (isInvalidDate(body.start_date, body.end_date))
      throw new Error("날짜 형식이 올바르지 않습니다.");

    if (getDate(startDate) < getToday()) throw new Error("start_date는 현재보다 미래여야 합니다.");
    if (getDate(endDate) <= getDate(startDate))
      throw new Error("end_date는 start_date보다 미래여야 합니다.");

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

export const updatePostDao = async ({ postData, imgURLs, imgToDelete }) => {
  const conn = await pool.getConnection();
  console.log(postData, imgURLs, imgToDelete);
  try {
    await conn.beginTransaction();
    await conn.query(updatePostSQL, [
      postData.title,
      postData.content,
      postData.start_date,
      postData.end_date,
      postData.question,
      postData.id,
    ]);
    // 추가할 이미지
    for (const url of imgURLs) {
      await conn.query(createPostImgSQL, [url, postData.id]);
    }
    // 삭제할 이미지
    if (imgToDelete.length > 0) {
      for (const url of imgToDelete) {
        await conn.query(deletePostImgSQL, [postData.id, url]);
      }
    }

    await conn.commit();
    return {
      postTitle: postData.title,
      postContent: postData.content,
      addImgURLs: imgURLs, // 추가할 이미지
      deleteImgURLs: imgToDelete, // 삭제할 이미지
      startDate: postData.start_date,
      endDate: postData.end_date,
      question: postData.question,
    };
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
    return result.map((user) => user.user_id);
  } catch (error) {
    console.log("User 검색 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const userProfileDao = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(userProfileSQL, [roomId, userId]);
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
  try {
    const conn = await pool.getConnection();

    const [checkUser] = await conn.query(checkUserInRoomSQL, [body.nickname, body.room_id]);
    if (!checkUser.length) {
      conn.release();
      return -1;
    }
    await conn.query(deleteUserSQL, [body.nickname, body.room_id]);

    conn.release();
    return "유저 강퇴에 성공하였습니다.";
  } catch (error) {
    console.log("유저 강퇴하기 에러");
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
    const date = new Date(`20${endDate}`);
    const jobName = `#${postId}PostPenalty`;
    console.log(date.toString());
    console.log(postId, "번 공지글 페널티 부여 예약");
    schedule.scheduleJob(jobName, date, async function () {
      await conn.query(imposePenaltyByPostSQL, [postId]);
      console.log(postId, "번 공지글 페널티 부여 실행");
      const jobList = schedule.scheduledJobs;
      console.log(jobList);
    });
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
    const jobList = schedule.scheduledJobs;
    console.log(jobList);
    console.log("마감기한이 지나지 않은 모든 공지글에 대한 페널티 부여 예약 성공");
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
