import { findUserById, findUserByEmail, insertUser } from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";

export const signupUser = async (userInfo) => {
  const { name, nickname, email, password } = userInfo;

  // 비밀번호 해싱
  const hashedPassword = passwordHashing(password);

  const signupUserData = await insertUser({
    name: name,
    nickname: nickname,
    email: email,
    password: hashedPassword,
  });

  const userData = await findUserById(signupUserData);

  return {
    userId: userData.id,
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
    return { userId: userData.id };
  } else {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
};
