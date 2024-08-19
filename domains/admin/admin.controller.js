// admin.controller.js
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import {
  createRoomsService,
  updateRoomsService,
  deleteRoomsService,
  createPostService,
  updatePostService,
  deletePostService,
  unreadUserListService,
  userListService,
  userProfileService,
  userInviteService,
  deleteUserService,
  userSubmitService,
  userRequestService,
  getRoomsService,
} from "./admin.service.js";

export const createRoomsController = async (req, res, next) => {
  try {
    const result = await createRoomsService(req.body, req.user.userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const updateRoomsController = async (req, res, next) => {
  try {
    const result = await updateRoomsService(req.body, req.params.roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getRoomsController = async (req, res, next) => {
  try {
    const result = await getRoomsService(req.params.roomId, req.user.userId);
    if (result === -1) {
      return res.status(400).json(response(status.NOT_MY_ROOM));
    }
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteRoomsController = async (req, res, next) => {
  try {
    const result = await deleteRoomsService(req.params.roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req, res, next) => {
  try {
    const result = await createPostService(req.body, req.user.userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req, res, next) => {
  try {
    const result = await updatePostService(req.body, req.params.postId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    const result = await deletePostService(req.params.postId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const unreadUserListController = async (req, res, next) => {
  try {
    const result = await unreadUserListService(req.params.postId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userListController = async (req, res, next) => {
  try {
    const result = await userListService(req.query.nickname, req.query.roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userProfileController = async (req, res, next) => {
  try {
    const result = await userProfileService(req.query.roomId, req.query.userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userInviteController = async (req, res, next) => {
  try {
    const result = await userInviteService(req.params.roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userSubmitController = async (req, res, next) => {
  try {
    const result = await userSubmitService(req.params.roomId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userRequestController = async (req, res, next) => {
  try {
    const result = await userRequestService(req.params.submitId, req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
