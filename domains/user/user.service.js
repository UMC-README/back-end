import {
  insertUser,
  findUserById,
  findUserByEmail,
  findFixedPostByUserId,
  findCreateRoomByUserId,
  findJoinRoomByUserId,
} from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";
import { generateJWTToken } from "../../utils/generateToken.js";

export const signupUser = async (userInfo) => {
  // 비밀번호 해싱
  const hashedPassword = passwordHashing(userInfo.password);

  const signupUserData = await insertUser({
    ...userInfo,
    password: hashedPassword,
  });

  const userData = await findUserById(signupUserData);

  const tokenInfo = generateJWTToken(userData.id);

  return {
    userId: userData.id,
    accessToken: tokenInfo,
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
