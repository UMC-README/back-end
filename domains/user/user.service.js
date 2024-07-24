import { findUserById, findUserByEmail, insertUser } from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";
import { generateJWTToken } from "../../utils/generateToken.js";

export const signupUser = async (userInfo) => {
  const { password, ...restUserInfo } = userInfo;

  // 비밀번호 해싱
  const hashedPassword = passwordHashing(password);

  const signupUserData = await insertUser({
    ...restUserInfo,
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

  const tokenInfo = generateJWTToken(userData.id);

  if (!userData) {
    throw new Error("등록되지 않은 이메일 입니다.");
  }

  // 입력된 비밀번호 해싱
  const hashedPassword = passwordHashing(password);

  if (hashedPassword === userData.password) {
    return { userId: userData.id, accessToken: tokenInfo };
  } else {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
};

export const getUserProfile = async (userId) => {
  const userData = await findUserById(userId);

  return {
    userId: userData.id,
    name: userData.name,
    nickname: userData.nickname,
    email: userData.email,
  };
};
