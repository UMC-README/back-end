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
    const result = await updateRoomsService(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteRoomsController = async (req, res, next) => {
  try {
    const result = await deleteRoomsService(req.body);
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
    const result = await updatePostService(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    const result = await deletePostService(req.body.id);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const unreadUserListController = async(req, res, next) => { 
  try {
    const result = await unreadUserListService(req.params.postId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userListController = async (req,res,next) => { 
  try{ 
    const result = await userListService(req.query.nickname);
    res.status(200).json(response(status.SUCCESS, result));
  }catch (error){
    next(error); 
  }
};

export const userProfileController = async (req, res, next) => {
  try {
    const result = await userProfileService(req.params.userId);
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
