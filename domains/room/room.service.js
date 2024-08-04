import {
  deleteFixPostDao,
  fixPostDao,
  getAllPostInRoomDao,
  getNotCheckedPostInRoomDao,
  getDetailedPostDao,
  getCommentsDao,
  postCommentDao,
  deleteCommentDao,
  getSubmitRequirementsDao,
  postSubmitDAO,
} from "./room.dao.js";

import {
  allPostInRoomDTO,
  notCheckedPostInRoomDTO,
  detailedPostDTO,
  allCommentsInPostDTO,
} from "./room.dto.js";

export const postFix = async (postId, userId) => {
  const fixPostData = await fixPostDao({
    postId,
    userId,
  });

  if (fixPostData == -1) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  if (fixPostData == -2) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return fixPostData;
};

export const deletePostFix = async (userId) => {
  const fixPostData = await deleteFixPostDao({
    userId: userId,
  });

  if (fixPostData == -1) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return fixPostData;
};

export const getAllPostInRoom = async (roomId, userId, query) => {
  const { postId, size = 10 } = query;

  const roomData = await getAllPostInRoomDao(roomId, userId, postId, size);

  if (getAllPostInRoomDao == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return allPostInRoomDTO(roomData);
};

export const getNotCheckedPostInRoom = async (roomId, userId) => {
  const roomData = await getNotCheckedPostInRoomDao(roomId, userId);

  if (getNotCheckedPostInRoomDao == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return notCheckedPostInRoomDTO(roomData);
};

export const getDetailedPostSer = async (postId, userId) => {
  const roomData = await getDetailedPostDao(postId, userId);

  if (getDetailedPostDao == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return detailedPostDTO(roomData);
};

export const getCommentsSer = async (postId, query) => {
  const { commentId, size = 100 } = query;

  const postData = await getCommentsDao(postId, commentId, size);
  const commentData = allCommentsInPostDTO(postData);

  if (commentData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  if (commentData == -2) {
    return null;
  }

  return commentData;
};

export const postCommentSer = async (postId, userId, content) => {
  const commentData = await postCommentDao(postId, userId, content);

  if (commentData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return { commentId: commentData };
};

export const deleteCommentSer = async (commentId, userId) => {
  const commentData = await deleteCommentDao(commentId, userId);

  if (commentData == -1) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }

  if (commentData == -2) {
    throw new Error("삭제 권한 오류: 댓글 작성자가 아닙니다.");
  }

  return { deletedCommentId: commentData };
};

export const getSubmitRequirementsSer = async (postId) => {
  const postData = await getSubmitRequirementsDao(postId);

  if (postData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return postData;
};

export const postSubmitService = async (postId, userId, content, imageURLs) => {
  const submitData = await postSubmitDAO(postId, userId, content, imageURLs);

  if (submitData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  if (submitData == -2) {
    throw new Error("Quiz에 제출하기 위한 답변 내용이 없습니다.");
  }

  if (submitData == -3) {
    throw new Error("Mission에 제출하기 위한 사진이 없습니다.");
  }

  return submitData;
};
