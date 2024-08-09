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
  postSubmitSQL,
  decreaseUnreadCountOneByPostId,
  postSubmitImageSQL,
  deletePreviousSubmitImageSQL,
  getSubmitIdByPostIdAndUserId,
  getRoomEntranceInfoByRoomId,
  checkRoomPasswordSQL,
  createRoomEntranceSQL,
} from "./room.sql.js";
import { getUserById } from "../user/user.sql.js";

export const fixPostDAO = async (data) => {
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

    await conn.query(changeFixedPostSQL, [data.postId, data.userId]);

    conn.release();
    return "고정 공지글 등록 성공";
  } catch (error) {
    console.log("고정 공지글 등록 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteFixPostDAO = async (data) => {
  try {
    const conn = await pool.getConnection();

    const [user] = await conn.query(getUserById, data.userId);

    if (user.length == 0) {
      conn.release();
      return -1;
    }

    await conn.query(changeFixedPostSQL, [null, data.userId]);

    conn.release();
    return "고정 공지글 삭제 성공";
  } catch (error) {
    console.log("고정 공지글 삭제 에러", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPostInRoomDAO = async (roomId, userId, cursorId, size) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    const isRoomAdmin = userId === room[0].admin_id;

    if (cursorId == "undefined" || typeof cursorId == "undefined" || cursorId == null) {
      const [posts] = await pool.query(getPostDetailsByRoomIdAtFirst, [+roomId, +userId, +size]);
      if (posts.length == 0) {
        conn.release();
        return -2;
      }
      conn.release();
      return { isRoomAdmin, posts };
    } else {
      const [posts] = await pool.query(getPostDetailsByRoomId, [
        +roomId,
        +userId,
        +cursorId,
        +size,
      ]);
      if (posts.length == 0) {
        conn.release();
        return -2;
      }
      conn.release();
      return { isRoomAdmin, posts };
    }
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getNotCheckedPostInRoomDAO = async (roomId, userId) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    const [posts] = await pool.query(getMyNotCheckedPostInRoom, [roomId, userId]);
    if (posts.length == 0) {
      conn.release();
      return -2;
    }
    conn.release();
    return posts;
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getDetailedPostDAO = async (postId, userId) => {
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

export const getCommentsDAO = async (postId, cursorId, size) => {
  try {
    const conn = await pool.getConnection();
    const [post] = await pool.query(getPostById, postId);

    if (post.length == 0) {
      conn.release();
      return -1;
    }

    if (cursorId == "undefined" || typeof cursorId == "undefined" || cursorId == null) {
      const [comments] = await pool.query(getCommentsByPostIdAtFirst, [+postId, +size]);
      if (comments.length == 0) {
        conn.release();
        return -2;
      }
      conn.release();
      return comments;
    } else {
      const [comments] = await pool.query(getCommentsByPostId, [+postId, +cursorId, +size]);
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

export const postCommentDAO = async (postId, userId, content) => {
  const conn = await pool.getConnection();
  const [post] = await conn.query(getPostById, postId);

  if (post.length == 0) {
    conn.release();
    return -1;
  }

  try {
    await conn.beginTransaction();

    const result = await conn.query(postCommentSQL, [postId, userId, content]);
    await conn.query(increaseCommentCountOneByPostId, postId);

    await conn.commit();
    conn.release();
    return result[0].insertId;
  } catch (error) {
    console.log("댓글 작성 에러", error);
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const deleteCommentDAO = async (commentId, userId) => {
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

    await conn.query(deleteCommentSQL, commentId);
    await conn.query(decreaseCommentCountOneByPostId, comment[0].post_id);

    await conn.commit();
    conn.release();
    return commentId;
  } catch (error) {
    console.log("댓글 삭제 에러", error);
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getSubmitRequirementsDAO = async (postId) => {
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

export const postSubmitDAO = async (postId, userId, content, imageURLs) => {
  const conn = await pool.getConnection();
  const [post] = await conn.query(getPostById, postId);

  if (post.length == 0) {
    conn.release();
    return -1;
  }

  const validateSubmitId = async (submit) => {
    if (!submit[0].insertId) {
      const [findSubmitId] = await pool.query(getSubmitIdByPostIdAndUserId, [postId, userId]);
      return findSubmitId[0].id;
    } else {
      return submit[0].insertId;
    }
  };

  try {
    await conn.beginTransaction();
    if (post[0].type == "QUIZ") {
      if (!content) {
        await conn.rollback();
        conn.release();
        return -2;
      }
      if (content == post[0].quiz_answer) {
        const submit = await conn.query(postSubmitSQL, [
          postId,
          userId,
          content,
          "COMPLETE",
          content,
          "COMPLETE",
        ]);
        await conn.query(decreaseUnreadCountOneByPostId, postId);

        await conn.commit();
        conn.release();
        return {
          submitId: await validateSubmitId(submit),
          submitState: "COMPLETE",
        };
      } else {
        const submit = await conn.query(postSubmitSQL, [
          postId,
          userId,
          content,
          "NOT_COMPLETE",
          content,
          "NOT_COMPLETE",
        ]);

        await conn.commit();
        conn.release();
        return {
          submitId: await validateSubmitId(submit),
          submitState: "NOT_COMPLETE",
        };
      }
    } else {
      if (!imageURLs || (Array.isArray(imageURLs) && imageURLs.length === 0)) {
        await conn.rollback();
        conn.release();
        return -3;
      }
      const submit = await conn.query(postSubmitSQL, [
        postId,
        userId,
        content,
        "PENDING",
        content,
        "PENDING",
      ]);

      await conn.query(deletePreviousSubmitImageSQL, [postId, userId]);
      const submitId = await validateSubmitId(submit);

      imageURLs.forEach((URL) => {
        conn.query(postSubmitImageSQL, [submitId, URL]);
      });

      await conn.commit();
      conn.release();
      return { submitId: submitId, submitState: "PENDING" };
    }
  } catch (error) {
    console.log("제출 에러", error);
    await conn.rollback();
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getRoomEntranceDAO = async (roomId) => {
  try {
    const conn = await pool.getConnection();

    const [roomInfo] = await conn.query(getRoomEntranceInfoByRoomId, roomId);
    if (roomInfo.length == 0) {
      conn.release();
      return -1;
    }
    conn.release();
    return roomInfo[0];
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const checkPasswordDAO = async (roomId, passwordInput) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    const [isValid] = await conn.query(checkRoomPasswordSQL, [passwordInput, roomId]);
    conn.release();
    return isValid[0].isValidResult;
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const postRoomEntranceDAO = async (roomId, userId, userNickname) => {
  try {
    const conn = await pool.getConnection();

    const [room] = await conn.query(getRoomById, roomId);

    if (room.length == 0) {
      conn.release();
      return -1;
    }

    await conn.query(createRoomEntranceSQL, [userId, roomId, userNickname]);
    conn.release();
    return true;
  } catch (err) {
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
