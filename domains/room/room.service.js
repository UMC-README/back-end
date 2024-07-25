import { fixPostDao } from "./room.dao.js";
import { findUserById } from "../user/user.dao.js";

export const postFix = async (body) => {
  const fixPostData = await fixPostDao({
    postId: body.postId,
    userId: body.userId,
  });

  const userData = await findUserById(fixPostData);

  return {
    postId: userData.postId,
    userId: userData.userId,
  };
};
