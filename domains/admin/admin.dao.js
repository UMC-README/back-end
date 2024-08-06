import { MAX } from "uuid";
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {
  createRoomsSQL,
  updateRoomsSQL,
  deleteRoomsSQL,
  createPostSQL,
  getMemberCountSQL,
  createPostImgSQL,
  updatePostSQL,
  deletePostImgSQL,
  deletePostSQL,
  userListNameSQL,
  userListSQL,
  userProfileSQL,
  userInviteSQL,
  checkUserInRoomSQL,
  deleteUserSQL,
} from "./admin.sql.js";

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

export const createPostDao = async ({body, imgURLs}, userId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // 특정 공지방의 전체 멤버 수 카운트
    const [memberCountRows] = await conn.query(getMemberCountSQL, [body.room_id]);
    const initialUnreadCount = memberCountRows[0].user_count - 1;

    const [postResult] = await conn.query(createPostSQL, [
      body.room_id,
      body.type,
      body.title,
      body.content,
      body.start_date,
      body.end_date,
      body.question,
      initialUnreadCount, // unread_count
      userId, 
    ]);
    const result = postResult.insertId;

    imgURLs.forEach((url) => {
      conn.query(createPostImgSQL, [url, result], (error) => {
        if (error) {
          throw error;
        }
      });
    });
    await conn.commit(); // 트랜잭션 커밋(DB 반영)
    return {
      newPostId: result, // 생성된 공지글 ID
      postType: body.type,
      postTitle: body.title,
      postContent: body.content,
      imgURLs: imgURLs,
      startDate: body.start_date,
      endDate: body.end_date,
      question: body.question,
    };  
  } catch (error) {
    await conn.rollback(); // 오류 발생 시 롤백
    console.error("공지글 생성 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updatePostDao = async ({ postData, imgURLs, imgToDelete }) => {
  const conn = await pool.getConnection();
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

export const userListDao = async (nickname) => { 
  try {
    const conn = await pool.getConnection();

    let userListSQLQuery;
    let params = [];

    if (nickname && nickname.trim() !== '') { // nickname 유효성 검사
      userListSQLQuery = userListNameSQL;  
      params = [nickname]; 
    } else {
      userListSQLQuery = userListSQL; // 모든 유저 조회 쿼리
    }

    const [result] = await conn.query(userListSQLQuery, params);
    conn.release();
        return result.map(user => ({
      nickname: user.nickname,
      profile_image: user.profile_image
    })); 
  } catch (error) {
    console.log("User 검색 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};


export const userProfileDao = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(userProfileSQL, userId);
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
