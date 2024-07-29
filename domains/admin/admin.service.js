import { getUserByIdDao, createRoomsDao, updateRoomsDao, getUserProfile } from "./admin.dao.js";

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

export const getProfileUser = async (userId) => {
  try {
    console.log("유저 프로필 정보를 가져옵니다.");
    return await getUserProfile(userId);
  } catch (error) {
    throw error;
  }
};
