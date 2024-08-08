import {
  createRoomsDao,
  deleteRoomsDao,
  updateRoomsDao,
  createPostDao,
  updatePostDao,
  deletePostDao,
  unreadUserListDao,
  userListDao,
  userProfileDao,
  userInviteDao,
  deleteUserDao,
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

export const createPostService = async (body, userId) => {
  try {
    const postData = await createPostDao(body, userId);
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

export const unreadUserListService = async (postId) => {
  try {
    if (!postId) {
      throw new Error("공지글 ID가 필요합니다.");
    }
    const userData = await unreadUserListDao(postId);
    return userData || [];
  } catch (error) {
    console.error("미확인 유저 리스트 조회 에러 :", error);
    throw error;
  }
};

export const userListService = async (nickname) => {
  try {
    return await userListDao(nickname);
  } catch (error) {
    console.error("유저 목록 조회 에러:", error);
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

export const userInviteService = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error("조회할 공지방의 ID가 필요합니다.");
    }
    return await userInviteDao(roomId);
  } catch (error) {
    throw error;
  }
};

export const deleteUserService = async (body) => {
  try {
    const result = await deleteUserDao(body);
    if (result == -1) throw new Error("공지방에 유저가 없습니다.");
    return result;
  } catch (error) {
    throw error;
  }
};
