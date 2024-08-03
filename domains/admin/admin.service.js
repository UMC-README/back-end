import {
  createRoomsDao,
  deleteRoomsDao,
  updateRoomsDao,
  createPostDao,
  updatePostDao,
  deletePostDao,
  getUserProfile,
} from "./admin.dao.js";
import { createShortUUID } from "./uuid.js";
import { createRoomsDTO, updateRoomsDTO } from "./admin.dto.js";

export const createRoomsService = async (body, userId) => {
  try {
    const roomInviteUrl = createShortUUID();
    const createRoomsData = await createRoomsDao(body, userId, roomInviteUrl);
    return createRoomsDTO(createRoomsData);
  } catch (error) {
    console.error("공지방 생성하기 에러:", error);
    throw error;
  }
};

export const updateRoomsService = async (body) => {
  try {
    const updateRoomsData = await updateRoomsDao(body);
    return updateRoomsDTO(updateRoomsData);
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw error;
  }
};

export const deleteRoomsService = async (roomId) => {
  // 방의 ID가 제공되었는지 확인
  if (!roomId) {
    throw new Error("삭제할 방의 ID가 필요합니다.");
  }
  const deleteRoomsData = await deleteRoomsDao(roomId);
  if (deleteRoomsData.affectedRows === 0) {
    throw new Error("해당 ID의 공지방이 존재하지 않거나 이미 삭제되었습니다.");
  }
  return deleteRoomsData;
};

export const createPostService = async (body) => {
  try {
    const postId = await createPostDao(body);
    return postId; // 생성된 공지글 ID 반환
  } catch (error) {
    console.error("공지글 생성하기 에러:", error);
    throw error;
  }
};

export const updatePostService = async (body) => {
  try {
    const postId = await updatePostDao(body);
    return postId; // 수정된 공지글 ID 반환
  } catch (error) {
    console.error("공지글 수정하기 에러:", error);
    throw error;
  }
};

export const deletePostService = async (postId) => {
  if (!postId) {
    throw new Error("삭제할 공지글의 ID가 필요합니다.");
  }
  const deleteRoomsData = await deletePostDao(postId);
  if (deleteRoomsData.affectedRows === 0) {
    throw new Error("해당 ID의 공지글이 존재하지 않거나 이미 삭제되었습니다.");
  }
  return deleteRoomsData;
};

export const getProfileUser = async (userId) => {
  try {
    console.log("유저 프로필 정보를 가져옵니다.");
    return await getUserProfile(userId);
  } catch (error) {
    throw error;
  }
};
