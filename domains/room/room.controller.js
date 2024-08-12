import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import {
  deletePostFix,
  postFix,
  getAllPostInRoom,
  getNotCheckedPostInRoom,
  getDetailedPostService,
  getCommentsService,
  postCommentService,
  deleteCommentService,
  getSubmitRequirementsService,
  postSubmitService,
  getRoomEntranceService,
  checkPasswordService,
  postRoomEntranceService,
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

    const result = await getDetailedPostService(postId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    console.log("postId: ", postId);

    const result = await getCommentsService(postId, userId, req.query);
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

    const result = await postCommentService(postId, userId, content);
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

    const result = await deleteCommentService(commentId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getSubmitRequirements = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    console.log("postId: ", postId);

    const result = await getSubmitRequirementsService(postId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const postSubmit = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const content = req.body.content;
    const imageURLs = req.body.imageURLs;
    console.log("공지 확인 제출");

    const result = await postSubmitService(postId, userId, content, imageURLs);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getRoomEntrance = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user.userId;
    console.log("최초 입장시 공지방 정보 조회");

    const result = await getRoomEntranceService(roomId, userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const checkPassword = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const passwordInput = req.body.content;
    console.log("최초 입장시 공지방 정보 조회");

    const result = await checkPasswordService(roomId, passwordInput);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const postRoomEntrance = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user.userId;
    const userNickname = req.body.nickname;
    console.log("공지방 입장 등록");

    const result = await postRoomEntranceService(roomId, userId, userNickname);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
