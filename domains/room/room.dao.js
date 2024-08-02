import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import {
  changeFixedPostSQL,
  getPostById,
  getRoomById,
  getCommentById,
  getPostDetailsByRoomId,
  getPostDetailsByRoomIdAtFirst,
  getMyNotCheckedPostInRoom,
  getDetailedPostSQL,
  getPostImagesByPostId,
  getCommentsByPostIdAtFirst,
  getCommentsByPostId,
  postCommentSQL,
  increaseCommentCountOneByPostId,
  deleteCommentSQL,
  decreaseCommentCountOneByPostId,
  getSubmitRequirementsSQL,
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

export const getAllPostInRoomDao = async (roomId, userId, cursorId, size) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    if (cursorId == "undefined" || typeof cursorId == "undefined" || cursorId == null) {
      const [posts] = await pool.query(getPostDetailsByRoomIdAtFirst, [
        parseInt(roomId),
        parseInt(userId),
        parseInt(size),
      ]);
      conn.release();
      return posts;
    } else {
      const [posts] = await pool.query(getPostDetailsByRoomId, [
        parseInt(roomId),
        parseInt(userId),
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

export const getNotCheckedPostInRoomDao = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    const [posts] = await pool.query(getMyNotCheckedPostInRoom, [
      parseInt(roomId),
      parseInt(userId),
    ]);
    conn.release();
    return posts;
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getDetailedPostDao = async (postId, userId) => {
  try {
    const conn = await pool.getConnection();

    const [post] = await pool.query(getDetailedPostSQL, [userId, postId]);

    if (post.length == 0) {
      conn.release();
      return -1;
    }

    const [postImages] = await pool.query(getPostImagesByPostId, postId);
    conn.release();
    return { post, postImages };
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getCommentsDao = async (postId, cursorId, size) => {
  try {
    const conn = await pool.getConnection();

    const [post] = await pool.query(getPostById, postId);

    if (post.length == 0) {
      conn.release();
      return -1;
    }

    if (cursorId == "undefined" || typeof cursorId == "undefined" || cursorId == null) {
      const [comments] = await pool.query(getCommentsByPostIdAtFirst, [postId, size]);
      if (comments.length == 0) {
        conn.release();
        return -2;
      }
      conn.release();
      return comments;
    } else {
      const [comments] = await pool.query(getCommentsByPostId, [postID, cursorId, size]);
      if (comments.length == 0) {
        conn.release();
        return -2;
      }
      conn.release();
      return comments;
    }
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const postCommentDao = async (postId, userId, content) => {
  const conn = await pool.getConnection();
  const [post] = await conn.query(getPostById, postId);

  if (post.length == 0) {
    conn.release();
    return -1;
  }

  try {
    await conn.beginTransaction();

    const result = await conn.query(postCommentSQL, [postId, userId, content]);
    const updateCommentCount = await conn.query(increaseCommentCountOneByPostId, postId);

    await conn.commit();
    conn.release();
    return result[0].insertId;
  } catch (error) {
    console.log("댓글 작성 에러", error);
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteCommentDao = async (commentId, userId) => {
  const conn = await pool.getConnection();
  const [comment] = await conn.query(getCommentById, commentId);

  if (comment.length == 0) {
    conn.release();
    return -1;
  }

  if (comment[0].user_id != userId) {
    conn.release();
    return -2;
  }

  try {
    await conn.beginTransaction();

    const result = await conn.query(deleteCommentSQL, commentId);
    const updateCommentCount = await conn.query(
      decreaseCommentCountOneByPostId,
      comment[0].post_id
    );

    await conn.commit();
    conn.release();
    return commentId;
  } catch (error) {
    console.log("댓글 삭제 에러", error);
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getSubmitRequirementsDao = async (postId) => {
  try {
    const conn = await pool.getConnection();

    const [post] = await conn.query(getPostById, postId);

    if (post.length == 0) {
      conn.release();
      return -1;
    }

    const [requirements] = await conn.query(getSubmitRequirementsSQL, postId);
    conn.release();
    return requirements[0];
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
