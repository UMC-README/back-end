import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import {
  deletePostFix,
  postFix,
  getAllPostInRoom,
  getNotCheckedPostInRoom,
  getDetailedPostSer,
  getCommentsSer,
  postCommentSer,
  deleteCommentSer,
} from "./room.service.js";

export const fixPost = async (req, res, next) => {
  try {
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

export const getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    console.log("postId: ", postId);

    const result = await getCommentsSer(postId, req.query);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const postComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const content = req.body.content;
    console.log("postId: ", postId);
    console.log("userId: ", userId);
    console.log("content: ", content);

    const result = await postCommentSer(postId, userId, content);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    console.log("commentId: ", commentId);
    console.log("userId: ", userId);

    const result = await deleteCommentSer(commentId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
