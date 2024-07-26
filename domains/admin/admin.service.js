import { createRoomsDao, getUserProfile } from "./admin.dao.js";

export const createRoomsService = async (userId) => {
  try {
    console.log("유저 ID를 가져옵니다.");
    return await createRoomsDao(userId);
  } catch (error) {
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
