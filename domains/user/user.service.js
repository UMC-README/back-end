import {
  insertUser,
  findUserById,
  findUserByEmail,
  findFixedPostByUserId,
  findCreateRoomByUserId,
  findJoinRoomByUserId,
  findRoomByUserId,
  updateUserProfileById,
} from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";
import { generateJWTToken } from "../../utils/generateToken.js";

export const signupUser = async (userInfo, token) => {
  // 비밀번호 해싱
  const hashedPassword = passwordHashing(userInfo.password.toString());

  const userId = await insertUser({
    ...userInfo,
    password: hashedPassword,
  });

  const accessToken = generateJWTToken(userId);

  return {
    userId,
    accessToken: token ?? accessToken,
  };
};

export const loginUser = async (email, password) => {
  const userData = await findUserByEmail(email);

  if (!userData) {
    throw new Error("등록되지 않은 이메일 입니다.");
  }

  // 입력된 비밀번호 해싱
  const hashedPassword = passwordHashing(password);

  if (hashedPassword === userData.password) {
    const tokenInfo = generateJWTToken(userData.id);

    return {
      userId: userData.id,
      accessToken: tokenInfo,
    };
  } else {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
};

export const kakaoLoginUser = async (email) => {
  const userData = await findUserByEmail(email);

  if (!userData) {
    return false;
  }
  return true;
};

export const getUserProfile = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return {
    userId: userData.id,
    name: userData.name,
    nickname: userData.nickname,
    email: userData.email,
    profileImage: userData.profile_image,
  };
};

export const updateBasicProfile = async (userId, name, nickname, profileImage) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  await updateUserProfileById(userId, name, nickname, profileImage);

  return true;
};

export const getMyFixedPost = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const fixedPostData = await findFixedPostByUserId(userData.userId);

  if (!fixedPostData) {
    return null;
  }

  return {
    postId: fixedPostData.id,
    title: fixedPostData.title,
    startDate: fixedPostData.start_date,
    endDate: fixedPostData.end_date,
  };
};

export const getMyRoomProfiles = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const rooms = await findRoomByUserId(userData.userId);

  if (!rooms) {
    return {
      nickname: userData.nickname,
      email: userData.email,
      profileImage: userData.profile_image,
    };
  }

  return {
    nickname: userData.nickname,
    email: userData.email,
    profileImage: userData.profile_image,
    profiles: [rooms],
  };
};

export const getMyCreateRoom = async (userId, page, pageSize) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const { rooms, isNext } = await findCreateRoomByUserId(userData.userId, page, pageSize);

  if (!rooms) {
    return { rooms: null, isNext: false };
  }

  return { rooms, isNext };
};

export const getMyJoinRoom = async (userId, page, pageSize) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const { rooms, isNext } = await findJoinRoomByUserId(userData.userId, page, pageSize);

  if (!rooms) {
    return { rooms: null, isNext: false };
  }

  return { rooms, isNext };
};
