import {
  deleteFixPostDAO,
  fixPostDAO,
  getAllPostInRoomDAO,
  getNotCheckedPostInRoomDAO,
  getDetailedPostDAO,
  getCommentsDAO,
  postCommentDAO,
  deleteCommentDAO,
  getSubmitRequirementsDAO,
  postSubmitDAO,
  getRoomEntranceDAO,
  checkPasswordDAO,
  postRoomEntranceDAO,
} from "./room.dao.js";

import {
  allPostInRoomDTO,
  notCheckedPostInRoomDTO,
  detailedPostDTO,
  allCommentsInPostDTO,
} from "./room.dto.js";

export const postFix = async (postId, userId) => {
  const fixPostData = await fixPostDAO({
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
  const fixPostData = await deleteFixPostDAO({
    userId: userId,
  });

  if (fixPostData == -1) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return fixPostData;
};

export const getAllPostInRoom = async (roomId, userId, query) => {
  const { postId, size = 10 } = query;

  const roomData = await getAllPostInRoomDAO(roomId, userId, postId, size);

  if (roomData == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  if (roomData == -2) {
    throw new Error("입장되어있는 공지방이 아닙니다.");
  }

  return allPostInRoomDTO(roomData);
};

export const getNotCheckedPostInRoom = async (roomId, userId) => {
  const roomData = await getNotCheckedPostInRoomDAO(roomId, userId);

  if (roomData == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return notCheckedPostInRoomDTO(roomData);
};

export const getDetailedPostService = async (postId, userId) => {
  const roomData = await getDetailedPostDAO(postId, userId);

  if (roomData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return detailedPostDTO(roomData);
};

export const getCommentsService = async (postId, userId, query) => {
  const { commentId, size = 20 } = query;

  const postData = await getCommentsDAO(postId, commentId, size);

  if (postData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return allCommentsInPostDTO(postData, userId);
};

export const postCommentService = async (postId, userId, content) => {
  const commentData = await postCommentDAO(postId, userId, content);

  if (commentData == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return { commentId: commentData };
};

export const deleteCommentService = async (commentId, userId) => {
  const commentData = await deleteCommentDAO(commentId, userId);

  if (commentData == -1) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }

  if (commentData == -2) {
    throw new Error("삭제 권한 오류: 댓글 작성자가 아닙니다.");
  }

  return { deletedCommentId: commentData };
};

export const getSubmitRequirementsService = async (postId) => {
  const postData = await getSubmitRequirementsDAO(postId);

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

export const getRoomEntranceService = async (uuid, userId) => {
  const roomData = await getRoomEntranceDAO(uuid, userId);
  if (roomData == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return roomData;
};

export const checkPasswordService = async (roomId, passwordInput) => {
  const roomData = await checkPasswordDAO(roomId, passwordInput);

  if (roomData == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  if (roomData == 0) {
    return { isValid: false };
  }

  if (roomData == 1) {
    return { isValid: true };
  }
};

export const postRoomEntranceService = async (roomId, userId, userNickname) => {
  const userRoomData = await postRoomEntranceDAO(roomId, userId, userNickname);

  if (userRoomData == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return { isSuccess: userRoomData };
};
