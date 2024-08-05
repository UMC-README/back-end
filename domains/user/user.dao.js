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
  getRoom,
  updateUserProfile,
  updateUserPassword,
  updateUserRoomProfile,
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
    await conn.query(updateUserRoomProfile, [nickname, profileImage, userId, roomId]);

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

export const findRoomByUserId = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [rooms] = await conn.query(getRoom, [userId]);

    if (rooms.length == 0) {
      conn.release();
      return null;
    }

    conn.release();
    return rooms.map((room) => ({
      nickname: room.nickname,
      profileImage: room.profile_image,
      roomName: room.room_name,
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
    return { rooms, isNext };
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
    return { rooms, isNext };
  } catch (error) {
    console.log("내가 입장한 공지방 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
