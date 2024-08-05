import {
  insertUser,
  findUserById,
  findUserByEmail,
  findFixedPostByUserId,
  findCreateRoomByUserId,
  findJoinRoomByUserId,
  findRoomByUserId,
  updateUserProfileById,
  updateUserPasswordById,
  updateUserRoomProfileById,
} from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";
import { generateJWTToken } from "../../utils/generateToken.js";
import { getRelativeTime, getYearMonthDay } from "../../utils/timeChange.js";

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

export const verifyUserPassword = async (userId, password) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const hashedPassword = passwordHashing(password);

  return hashedPassword === userData.password;
};

export const updatePassword = async (userId, password) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const hashedPassword = passwordHashing(password);

  await updateUserPasswordById(userId, hashedPassword);

  return true;
};

export const updateBasicProfile = async (userId, name, nickname, profileImage) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  await updateUserProfileById(userId, name, nickname, profileImage);

  return true;
};

export const updateRoomProfile = async (userId, roomId, nickname, profileImage) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  await updateUserRoomProfileById(userId, roomId, nickname, profileImage);

  return true;
};

export const getMyFixedPost = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const fixedPostData = await findFixedPostByUserId(userId);

  if (!fixedPostData) {
    return null;
  }

  return {
    roomId: fixedPostData.room_id,
    postId: fixedPostData.id,
    title: fixedPostData.title,
    startDate: getYearMonthDay(fixedPostData.start_date),
    endDate: getYearMonthDay(fixedPostData.end_date),
  };
};

export const getMyRoomProfiles = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const rooms = await findRoomByUserId(userId);

  if (!rooms) {
    return {
      nickname: userData.nickname,
      profileImage: userData.profile_image,
    };
  }

  return {
    nickname: userData.nickname,
    profileImage: userData.profile_image,
    profiles: rooms,
  };
};

export const getMyCreateRoom = async (userId, page, pageSize) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const { rooms, isNext } = await findCreateRoomByUserId(userId, page, pageSize);

  if (!rooms) {
    return { rooms: null, isNext: false };
  }

  const Myrooms = rooms.map((room) => ({
    id: room.id,
    nickname: room.user_nickname,
    roomName: room.room_name,
    roomImage: room.room_image,
    state: room.state,
    latestPostTime: getRelativeTime(room.latest_post_time),
  }));

  return { rooms: Myrooms, isNext };
};

export const getMyJoinRoom = async (userId, page, pageSize) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const { rooms, isNext } = await findJoinRoomByUserId(userId, page, pageSize);

  if (!rooms) {
    return { rooms: null, isNext: false };
  }

  const Myrooms = rooms.map((room) => ({
    id: room.id,
    nickname: room.user_nickname,
    roomName: room.room_name,
    roomImage: room.room_image,
    state: room.state,
    latestPostTime: getRelativeTime(room.latest_post_time),
  }));

  return { rooms: Myrooms, isNext };
};
