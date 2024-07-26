import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { createRoomsSQL, getProfileByUserId } from "./admin.sql.js";

export const createRoomsDao = async (data) => {
  try {
    const conn = await pool.getConnection();
    console.log(data);
    const result = await conn.query(createRoomsSQL, [
      data.admin_id,
      data.admin_nickname,
      data.room_name,
      data.room_password,
      data.room_image,
      data.room_invite_url,
      data.max_penalty,
    ]);
    console.log("2");
    return result;
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
