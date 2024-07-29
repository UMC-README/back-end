import {
  getUserByIdDao,
  createRoomsDao,
  deleteRoomsDao,
  updateRoomsDao,
  createPostDao,
  getUserProfile,
} from "./admin.dao.js";

export const createRoomsService = async (data) => {
  try {
    console.log("공지방 생성에 관한 데이터를 가져옵니다.");
    return await createRoomsDao(data);
  } catch (error) {
    console.error("공지방 생성하기 에러:", error);
    throw error;
  }
};

export const updateRoomsService = async (roomData) => {
  const updateRoomsData = await updateRoomsDao(roomData);

  if (updateRoomsData.affectedRows === 0) {
    throw new Error("공지방 수정에 실패. 방 ID를 확인하세요.");
  }
  return updateRoomsData;
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

export const createPostService = async (postData, imgURL) => {
  try {
    const postId = await createPostDao(postData, imgURL);
    return postId; // 생성된 공지글 ID 반환
  } catch (error) {
    console.error("공지글 생성하기 에러:", error);
    throw error;
  }
};

export const getProfileUser = async (userId) => {
  try {
    console.log("유저 프로필 정보를 가져옵니다.");
    return await getUserProfile(userId);
  } catch (error) {
    throw error;
  }
};
