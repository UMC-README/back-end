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
  initializeSubmitByPostDAO,
  reserveImposePenaltyByPostDAO,
  cancelImposePenaltyByPostDAO,
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
    if (!body.room_id) {
      throw new Error("공지방 ID가 필요합니다.");
    }
    const postData = await createPostDao(body, userId);
    await initializeSubmitByPostDAO(postData.newPostId);
    await reserveImposePenaltyByPostDAO(postData.newPostId, postData.endDate);
    return createPostDTO(postData);
  } catch (error) {
    console.error("공지글 생성하기 에러:", error);
    throw error;
  }
};

export const updatePostService = async (body) => {
  try {
    const postData = await updatePostDao(body);
    await cancelImposePenaltyByPostDAO(body.postData.id);
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
      throw new Error("올바른 공지ID가 필요합니다.");
    }
    const userData = await unreadUserListDao(postId);
    return userData || [];
  } catch (error) {
    console.error("미확인 유저 리스트 조회 에러 :", error);
    throw error;
  }
};

export const userListService = async (nickname, roomId) => {
  try {
    if (!roomId) {
      throw new Error("조회할 공지방의 ID가 필요합니다.");
    }
    const result = await userListDao(nickname, roomId);

    if (!result.length) return [];
    return result.map((user) => ({
      userId: user.user_id,
      nickname: user.nickname,
      profileImage: user.profile_image,
    }));
  } catch (error) {
    console.error("유저 목록 조회 에러:", error);
    throw error;
  }
};

export const userProfileService = async (roomId, userId) => {
  try {
    if (!roomId || !userId) {
      throw new Error("공지방 혹은 사용자 ID가 필요합니다.");
    }
    const userProfileData = await userProfileDao(roomId, userId);
    return userProfileData || [];
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
