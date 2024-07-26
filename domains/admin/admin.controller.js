// admin.controller.js

import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { getProfileUser } from "./admin.service.js";

export const userProfile = async (req, res, next) => {
  try {
    console.log("특정 멤버 프로필 조회");
    const userId = req.params.user_id;
    const result = await getProfileUser(userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
