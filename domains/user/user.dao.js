import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import {
  userSignUpSQL,
  getUserById,
  getUserByEmail,
  getFixedPost,
  getCreateRoom,
  getJoinRoom,
  getCreateRoomCount,
  getJoinRoomCount,
  getAllRooms,
  updateUserProfile,
  updateUserPassword,
  updateUserRoomProfile,
  selectAdminId,
  updateRoomAdminNickname,
  checkDuplicateNickname,
  getLatestPostInRoom,
  getAllRoomsCount,
  getSubmitCountInRoom,
  getSubmitListInRoom,
  getSubmitImages,
  getPenaltyPost,
  getPenaltyCount,
} from "./user.sql.js";

export const insertUser = async (data) => {
  try {
    const conn = await pool.getConnection();

    const result = await conn.query(userSignUpSQL, [
      data.name,
      data.nickname,
      data.email,
      data.password,
    ]);

    conn.release();
    return result[0].insertId;
  } catch (error) {
    console.log("회원 가입 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findUserById = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [user] = await conn.query(getUserById, [userId]);

    if (user.length == 0) {
      conn.release();
      return null;
    }

    conn.release();
    return user[0];
  } catch (error) {
    console.log("아이디로 유저 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findUserByEmail = async (email) => {
  try {
    const conn = await pool.getConnection();
    const [user] = await conn.query(getUserByEmail, [email]);

    if (user.length == 0) {
      conn.release();
      return null;
    }

    conn.release();
    return user[0];
  } catch (error) {
    console.log("이메일로 유저 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserProfileById = async (userId, name, nickname, profileImage) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(updateUserProfile, [name, nickname, profileImage, userId]);

    conn.release();

    return true;
  } catch (error) {
    console.log("프로필 업데이트 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserRoomProfileById = async (userId, roomId, nickname, profileImage) => {
  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    // user-room의 프로필 수정
    await conn.query(updateUserRoomProfile, [nickname, profileImage, userId, roomId]);

    // 본인이 해당 공지방의 운영진인지 확인
    const [rows] = await conn.query(selectAdminId, [roomId, userId]);

    // 본인이 해당 공지방의 운영진이라면 room의 admin_nickname도 수정
    if (rows.length > 0) {
      await conn.query(updateRoomAdminNickname, [nickname, roomId, userId]);
    }

    await conn.commit();
    conn.release();

    return true;
  } catch (error) {
    console.log("공지방별 프로필 업데이트 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserPasswordById = async (userId, password) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(updateUserPassword, [password, userId]);

    conn.release();

    return true;
  } catch (error) {
    console.log("비밀번호 업데이트 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findFixedPostByUserId = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [post] = await conn.query(getFixedPost, [userId]);

    if (post.length == 0) {
      conn.release();
      return null;
    }

    conn.release();
    return post[0];
  } catch (error) {
    console.log("고정된 게시글 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findRoomByUserId = async (userId, page, pageSize) => {
  try {
    const conn = await pool.getConnection();
    const offset = (page - 1) * pageSize;
    const [rooms] = await conn.query(getAllRooms, [userId, pageSize, offset]);

    if (rooms.length == 0) {
      conn.release();
      return null;
    }

    conn.release();
    return rooms.map((room) => ({
      roomId: room.id,
      roomName: room.room_name,
      nickname: room.nickname,
      profileImage: room.profile_image,
    }));
  } catch (error) {
    console.log("내 공지방 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findCreateRoomByUserId = async (userId, page, pageSize) => {
  try {
    const conn = await pool.getConnection();
    const offset = (page - 1) * pageSize;

    const [[{ count }]] = await conn.query(getCreateRoomCount, [userId]);
    const [rooms] = await conn.query(getCreateRoom, [userId, pageSize, offset]);

    const isNext = offset + pageSize < count;

    conn.release();
    return { rooms, isNext, totalCount: count };
  } catch (error) {
    console.log("내가 생성한 공지방 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findJoinRoomByUserId = async (userId, page, pageSize) => {
  try {
    const conn = await pool.getConnection();
    const offset = (page - 1) * pageSize;

    const [[{ count }]] = await conn.query(getJoinRoomCount, [userId, userId]);
    const [rooms] = await conn.query(getJoinRoom, [userId, userId, pageSize, offset]);

    const isNext = offset + pageSize < count;

    conn.release();
    return { rooms, isNext, totalCount: count };
  } catch (error) {
    console.log("내가 입장한 공지방 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findDuplicateNickname = async (roomId, nickname) => {
  try {
    const conn = await pool.getConnection();
    const [[{ count }]] = await conn.query(checkDuplicateNickname, [roomId, nickname]);

    conn.release();
    return count > 0;
  } catch (error) {
    console.log("중복 닉네임 확인 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findAllRooms = async (userId, page, pageSize) => {
  try {
    const conn = await pool.getConnection();
    const offset = (page - 1) * pageSize;
    const [rooms] = await conn.query(getAllRooms, [userId, pageSize, offset]);
    conn.release();
    return rooms;
  } catch (error) {
    console.log("모든 공지방 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getRoomsCount = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [[{ count }]] = await conn.query(getAllRoomsCount, [userId]);
    conn.release();
    return count;
  } catch (error) {
    console.log("공지방 개수 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findLatestPostInRoom = async (roomId) => {
  try {
    const conn = await pool.getConnection();
    const [post] = await conn.query(getLatestPostInRoom, [roomId]);
    conn.release();
    return post[0];
  } catch (error) {
    console.log("가장 최근 공지글 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findSubmitCountInRoom = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [[{ submit_count }]] = await conn.query(getSubmitCountInRoom, [roomId, userId]);
    conn.release();
    return submit_count;
  } catch (error) {
    console.log("제출 개수 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findSubmitList = async (roomId) => {
  try {
    const conn = await pool.getConnection();
    const [submits] = await conn.query(getSubmitListInRoom, [roomId]);

    conn.release();
    return submits;
  } catch (error) {
    console.log("Submit 목록 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findSubmitImages = async (submitId) => {
  try {
    const conn = await pool.getConnection();
    const [images] = await conn.query(getSubmitImages, [submitId]);

    conn.release();
    return images.map((image) => image.URL);
  } catch (error) {
    console.log("Submit 이미지 목록 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findPenaltyCount = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [count] = await conn.query(getPenaltyCount, [roomId, userId]);
    conn.release();

    return count[0];
  } catch (error) {
    console.error("페널티 개수 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const findPenaltyPost = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();
    const [posts] = await conn.query(getPenaltyPost, [roomId, userId]);

    conn.release();
    return posts;
  } catch (error) {
    console.log("페널티 받은 공지글 목록 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
