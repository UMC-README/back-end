import { findUser, insertUser } from "./user.dao.js";

export const signupUser = async (userInfo) => {
  const { name, nickname, email, password } = userInfo;

  const signupUserData = await insertUser({
    name: name,
    nickname: nickname,
    email: email,
    password: password,
  });

  const userData = await findUser(signupUserData);

  return {
    userId: userData.id,
  };
};
