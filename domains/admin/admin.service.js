import { createRoomsDao, getUserProfile } from "./admin.dao.js";

export const createRoomsService = async (data) => {
  try {
    console.log("방 생성에 관한 데이터를 가져옵니다.");
    return await createRoomsDao(data);
  } catch (error) {
    console.error("방 생성하기 에러:", error);
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
