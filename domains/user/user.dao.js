import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getUserByEmail, getUserById, userSignUpSQL } from "./user.sql.js";

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

export const findUser = async (userId) => {
  try {
    const conn = await pool.getConnection();
    const [user] = await conn.query(getUserById, [userId]);

    if (user.length == 0) {
      conn.release();
      return -1;
    }

    conn.release();
    return user[0];
  } catch (error) {
    console.log("아이디로 유저 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const fintUserByEmail = async (email) => {
  try {
    const conn = await pool.getConnection();
    const [user] = await conn.query(getUserByEmail, [email]);

    if (user.length == 0) {
      conn.release();
      return -1;
    }

    conn.release();
    return user[0];
  } catch (error) {
    console.log("이메일로 유저 찾기 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
