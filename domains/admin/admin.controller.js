// admin.controller.js
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import {
  createRoomsService,
  updateRoomsService,
  deleteRoomsService,
  createPostService,
  getProfileUser,
} from "./admin.service.js";

export const createRoomsController = async (req, res, next) => {
  try {
    // 요청 바디에서 데이터 추출
    const {
      admin_id,
      admin_nickname,
      room_name,
      room_password,
      room_image,
      room_invite_url,
      max_penalty,
    } = req.body;

    // 필수 필드 확인
    if (
      !admin_id ||
      !admin_nickname ||
      !room_name ||
      !room_password ||
      !room_image ||
      !room_invite_url ||
      !max_penalty
    ) {
      return res.status(400).json({ error: "모든 필수 필드를 입력하세요." });
    }

    res.status(200).json(response(status.SUCCESS, req.body));
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
    const { postData, imgURL } = req.body;
    const result = await createPostService(postData, imgURL);

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
