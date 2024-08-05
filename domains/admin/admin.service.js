import {
  createRoomsDao,
  deleteRoomsDao,
  updateRoomsDao,
  createPostDao,
  updatePostDao,
  deletePostDao,
  userProfileDao,
} from "./admin.dao.js";
import { createShortUUID } from "./uuid.js";
import { createRoomsDTO, updateRoomsDTO, createPostDTO, updatePostDTO } from "./admin.dto.js";

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

export const deleteRoomsService = async (body) => {
  try {
    if (!body) throw new Error("삭제할 방의 ID가 필요합니다.");
    const deleteRoomsData = await deleteRoomsDao(body);
    return deleteRoomsData;
  } catch (error) {
    console.error("공지방 삭제하기 에러:", error);
    throw error;
  }
};

export const createPostService = async (body) => {
  try {
    const postData = await createPostDao(body);
    return createPostDTO(postData);
  } catch (error) {
    console.error("공지글 생성하기 에러:", error);
    throw error;
  }
};

export const updatePostService = async (body) => {
  try {
    const postData = await updatePostDao(body);
    return updatePostDTO(postData);
  } catch (error) {
    console.error("공지글 수정하기 에러:", error);
    throw error;
  }
};

export const deletePostService = async (postId) => {
  try {
    if (!postId) {
      throw new Error("삭제할 공지글의 ID가 필요합니다.");
    }
    const deleteRoomsData = await deletePostDao(postId);
    return deleteRoomsData;
  } catch (error) {
    console.error("공지글 삭제 에러:", error);
    throw error;
  }
};

export const userProfileService = async (userId) => {
  try {
    if (!userId) {
      throw new Error("삭제할 공지글의 ID가 필요합니다.");
    }
    return await userProfileDao(userId);
  } catch (error) {
    throw error;
  }
};
