import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { deletePostFix, postFix, getAllPostSER } from "./room.service.js";

export const fixPost = async (req, res, next) => {
  try {
    console.log("고정 공지글 등록");

    const userId = req.user.userId;
    const postId = req.body.postId;
    console.log("postId: ", postId);
    console.log("userId: ", userId);

    const result = await postFix(postId, userId);
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

export const getAllPost = async (req, res, next) => {
  try {
    console.log("공지방 내 모든 공지글 조회");

    const userId = req.user.userId;
    const roomId = req.params;

    console.log("userId: ", userId);
    console.log("roomId: ", userId);

    const result = await getAllPostSER(userId, roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
