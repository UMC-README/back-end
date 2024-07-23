import crypto from "crypto";
import { findUser, insertUser } from "./user.dao.js";

export const signupUser = async (userInfo) => {
  const { name, nickname, email, password } = userInfo;

  // 비밀번호 해싱
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const signupUserData = await insertUser({
    name: name,
    nickname: nickname,
    email: email,
    password: hashedPassword,
  });

  const userData = await findUser(signupUserData);

  return {
    userId: userData.id,
  };
};
