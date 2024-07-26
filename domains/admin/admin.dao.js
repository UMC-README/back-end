import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { createRoomsByUserId, getProfileByUserId } from "./admin.sql.js";

export const createRoomsDao = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(createRoomsByUserId, [userId]);

    if (rows.length === 0) {
      throw new BaseError(404, "User not found");
    }

    conn.release();
    return rows[0];
  } catch (error) {
    console.error("공지방 생성하기 에러");
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
