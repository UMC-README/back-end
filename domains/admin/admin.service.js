import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
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
  userRequestDao,
  getRoomsDao,
  getPostListDao,
  getSubmitListDao,
} from "./admin.dao.js";
import { createShortUUID } from "./uuid.js";
import {
  createRoomsDTO,
  createPostDTO,
  updatePostDTO,
  getRoomsDTO,
  postListDTO,
} from "./admin.dto.js";

export const createRoomsService = async (body, userId) => {
  try {
    if (!body.room_image) throw new Error("공지방 생성을 위한 프로필 이미지가 필요합니다.");
    const roomInviteUrl = createShortUUID();
    const createRoomsData = await createRoomsDao(body, userId, roomInviteUrl);
    return createRoomsDTO(createRoomsData);
  } catch (error) {
    console.error("공지방 생성하기 에러:", error);
    throw error;
  }
};

export const updateRoomsService = async (body, roomId) => {
  try {
    if (!roomId) throw new Error("수정할 공지방의 ID가 필요합니다.");
    const response = await updateRoomsDao(body, roomId);
    return response;
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw error;
  }
};

export const getRoomsService = async (roomId, userId) => {
  try {
    if (!roomId) throw new Error("수정할 공지방의 ID가 필요합니다.");
    const response = await getRoomsDao(roomId, userId);
    if (response === -1) {
      return -1;
    }
    return getRoomsDTO(response);
  } catch (error) {
    console.error("공지방 수정하기 에러:", error);
    throw error;
  }
};

export const deleteRoomsService = async (roomId) => {
  try {
    if (!roomId) throw new Error("삭제할 방의 ID가 필요합니다.");
    await deleteRoomsDao(roomId);
    return "공지방 삭제 성공";
  } catch (error) {
    console.error("공지방 삭제하기 에러:", error);
    throw error;
  }
};

export const createPostService = async (body, userId) => {
  try {
    if (!body.room_id) throw new Error("공지방 ID가 필요합니다.");

    const postData = await createPostDao(body, userId);

    if (postData == -1) throw new BaseError(status.WRONG_DATE_FORMAT);
    if (postData == -2) throw new BaseError(status.WRONG_STARTDATE_COMPARE);
    if (postData == -3) throw new BaseError(status.WRONG_ENDDATE_COMPARE);

    await initializeSubmitByPostDAO(postData.newPostId);
    await reserveImposePenaltyByPostDAO(postData.newPostId, `20${postData.endDate}`);
    return createPostDTO(postData);
  } catch (error) {
    console.error("공지글 생성하기 에러:", error);
    throw error;
  }
};

export const updatePostService = async (body, postId) => {
  try {
    const postData = await updatePostDao(body, postId);

    if (postData == -1) throw new BaseError(status.WRONG_DATE_FORMAT);
    if (postData == -2) throw new BaseError(status.WRONG_STARTDATE_COMPARE);
    if (postData == -3) throw new BaseError(status.WRONG_ENDDATE_COMPARE);

    await cancelImposePenaltyByPostDAO(postId);
    await reserveImposePenaltyByPostDAO(postId, `20${postData.endDate}`);
    return updatePostDTO(postData);
  } catch (error) {
    console.error("공지글 수정하기 에러:", error);
    throw error;
  }
};

export const deletePostService = async (postId) => {
  try {
    if (!postId) throw new Error("삭제할 공지글의 ID가 필요합니다.");

    const deleteRoomsData = await deletePostDao(postId);
    await cancelImposePenaltyByPostDAO(postId);
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
    if(!body.userId) throw new Error("강퇴할 User의 ID가 필요합니다.");
    const result = await deleteUserDao(body);
    if (result == -1) throw new Error("공지방에 유저가 없습니다.");
    return result;
  } catch (error) {
    throw error;
  }
};

// 확인 요청 내역 공지글 목록 조회
export const getPostListService = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error("요청 내역 조회를 위한 roomId가 필요합니다.");
    }

    const posts = await getPostListDao(roomId);

    const postLists = posts.map(postListDTO);

    return postLists;
  } catch (error) {
    throw error;
  }
};

// 하나의 공지글에 대한 확인 요청 내역 (대기 or 승인 완료) 조회
export const getSubmitListService = async (roomId, postId, state) => {
  try {
    if (!roomId || !postId) throw new Error("요청 내역 조회를 위한 roomId와 postId가 필요합니다.");
    if (state !== "pending" && state !== "complete") {
      throw new Error("pending 혹은 complete 중 하나의 값으로 요청해야합니다.");
    }

    const submitList = await getSubmitListDao(roomId, postId, state.toUpperCase());

    return submitList;
  } catch (error) {
    throw error;
  }
};

export const userRequestService = async (submitId, body) => {
  try {
    const validTypes = ["accept", "reject"];
    if (!validTypes.includes(body.type)) throw new Error("올바른 type을 입력하세요.");
    return await userRequestDao(submitId, body);
  } catch (error) {
    throw error;
  }
};
