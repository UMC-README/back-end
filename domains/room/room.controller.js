import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { deletePostFix, postFix } from "./room.service.js";

export const fixPost = async (req, res, next) => {
  try {
    console.log("고정 공지글 등록");

    const userId = req.user.userId;
    console.log("body: ", req.body);
    console.log("userId: ", userId);

    const result = await postFix(req.body, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteFixPost = async (req, res, next) => {
  try {
    console.log("고정 공지글 삭제");

    const userId = req.user.userId;
    console.log("userId: ", userId);

    const result = await deletePostFix(userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
