import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { postFix } from "./room.service.js";

export const fixPost = async (req, res, next) => {
  try {
    console.log("고정 공지글 변경");
    console.log("body: ", req.body);

    const result = await postFix(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
