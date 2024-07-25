import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { changeFixedPostSQL } from "./room.sql.js";

export const fixPostDao = async (data) => {
  try {
    const conn = await pool.getConnection();

    const result = await conn.query(changeFixedPostSQL, [data.postId, data.userId]);

    conn.release();
    return result[0].insertId;
  } catch (error) {
    console.log("고정 공지글 변경 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
