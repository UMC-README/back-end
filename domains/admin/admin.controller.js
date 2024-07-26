// admin.controller.js
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { createRoomsService, getProfileUser } from "./admin.service.js";

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

    // 데이터베이스 쿼리 실행
    const result = await createRoomsService({
      admin_id,
      admin_nickname,
      room_name,
      room_password,
      room_image,
      room_invite_url,
      max_penalty,
    });

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
