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
  getProfileByUserId,
} from "./admin.sql.js";

export const createRoomsDao = async (body, userId, roomInviteUrl) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(createRoomsSQL, [
      userId,
      body.room_image,
      body.admin_nickname,
      body.room_name,
      body.room_password,
      roomInviteUrl,
      body.max_penalty,
    ]);

    conn.release();
    return {
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

export const updateRoomsDao = async (roomData) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(updateRoomsSQL, [
      roomData.admin_nickname,
      roomData.room_name,
      roomData.room_password,
      roomData.room_image,
      roomData.max_penalty,
      roomData.id,
    ]);
    return result;
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteRoomsDao = async (roomId) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(deleteRoomsSQL, roomId);
    return result;
  } catch (error) {
    console.error("공지방 삭제하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const createPostDao = async ({ postData, imgURLs }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [memberCountRows] = await conn.query(getMemberCountSQL, [postData.room_id]);
    const initialUnreadCount = memberCountRows[0].user_count - 1; // 총 회원 수

    const [postResult] = await conn.query(createPostSQL, [
      postData.room_id,
      postData.title,
      postData.content,
      postData.type,
      postData.start_date,
      postData.end_date,
      postData.question,
      initialUnreadCount, // unread_count
      postData.user_id,
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
    return result;
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
    const [postResult] = await conn.query(updatePostSQL, [
      postData.title,
      postData.content,
      postData.start_date,
      postData.end_date,
      postData.question,
      postData.id,
    ]);
    // 추가
    for (const url of imgURLs) {
      await conn.query(createPostImgSQL, [url, postData.id]);
    }
    // 삭제
    if (imgToDelete.length > 0) {
      for (const url of imgToDelete) {
        await conn.query(deletePostImgSQL, [postData.id, url]);
      }
    }

    await conn.commit();
    return postResult;
  } catch (error) {
    await conn.rollback();
    console.error("공지글 수정하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deletePostDao = async (postId) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(deletePostSQL, postId);
    return result;
  } catch (error) {
    console.error("공지글 삭제하기 에러:", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(getProfileByUserId, userId);
    if (rows.length === 0) {
      conn.release();
      throw new BaseError(404, "User not found");
    }

    conn.release();
    return rows[0];
  } catch (error) {
    console.log("User 프로필 조회 에러");
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
