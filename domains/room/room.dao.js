import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import {
  changeFixedPostSQL,
  getPostById,
  getPostDetailsByRoomId,
  getPostDetailsByRoomIdAtFirst,
} from "./room.sql.js";
import { getUserById } from "../user/user.sql.js";

export const fixPostDao = async (data) => {
  try {
    const conn = await pool.getConnection();

    const [user] = await conn.query(getUserById, data.userId);
    const [post] = await conn.query(getPostById, data.postId);

    if (user.length == 0) {
      conn.release();
      return -1;
    }

    if (post.length == 0) {
      conn.release();
      return -2;
    }

    const result = await conn.query(changeFixedPostSQL, [data.postId, data.userId]);

    console.log(result);
    conn.release();
    return "고정 공지글 등록 성공";
  } catch (error) {
    console.log("고정 공지글 등록 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteFixPostDao = async (data) => {
  try {
    const conn = await pool.getConnection();

    const [user] = await conn.query(getUserById, data.userId);

    if (user.length == 0) {
      conn.release();
      return -1;
    }

    const result = await conn.query(changeFixedPostSQL, [null, data.userId]);

    console.log(result);
    conn.release();
    return "고정 공지글 삭제 성공";
  } catch (error) {
    console.log("고정 공지글 삭제 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPostInRoomDao = async (cursorId, size, roomId) => {
  try {
    const conn = await pool.getConnection();

    if (cursorId == "undefined" || typeof cursorId == "undefined" || cursorId == null) {
      const [posts] = await pool.query(getPostDetailsByRoomIdAtFirst, [
        parseInt(roomId),
        parseInt(size),
      ]);
      conn.release();
      return posts;
    } else {
      const [posts] = await pool.query(getPostDetailsByRoomId, [
        parseInt(roomId),
        parseInt(cursorId),
        parseInt(size),
      ]);
      conn.release();
      return posts;
    }
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
