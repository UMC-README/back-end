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
  getProfileUser,
} from "./admin.service.js";

export const createRoomsController = async (req, res, next) => {
  try {
    const result = await createRoomsService(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const updateRoomsController = async (req, res, next) => {
  try {
    const roomData = req.body;
    const result = await updateRoomsService(roomData);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const deleteRoomsController = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const result = await deleteRoomsService(roomId);

    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req, res, next) => {
  try {
    const result = await createPostService(req.body);
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

export const userProfile = async (req, res, next) => {
  try {
    console.log("특정 멤버 프로필 조회");
    const userId = req.user.user_id;
    const result = await getProfileUser(userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
