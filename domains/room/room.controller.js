import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import {
  deletePostFix,
  postFix,
  getAllPostInRoom,
  getNotCheckedPostInRoom,
  getDetailedPostSer,
} from "./room.service.js";

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

    const roomId = req.params.roomId;
    const userId = req.user.userId;

    console.log("roomId: ", roomId);
    console.log("userId: ", userId);

    const result = await getAllPostInRoom(roomId, userId, req.query);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getNotCheckedPost = async (req, res, next) => {
  try {
    console.log("공지방 내 완료하지 않은 공지글 조회");

    const roomId = req.params.roomId;
    const userId = req.user.userId;

    console.log("roomId: ", roomId);
    console.log("userId: ", userId);

    const result = await getNotCheckedPostInRoom(roomId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getDetailedPost = async (req, res, next) => {
  try {
    console.log("개별 공지글 상세 조회");

    const postId = req.params.postId;
    const userId = req.user.userId;

    console.log("postId: ", postId);
    console.log("userId: ", userId);

    const result = await getDetailedPostSer(postId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
