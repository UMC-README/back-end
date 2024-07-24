import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { sendCodeEmail } from "../../utils/email.js";

import { loginUser, signupUser } from "./user.service.js";

export const userSignUp = async (req, res, next) => {
  try {
    console.log("회원가입 요청");
    console.log("body: ", req.body);

    const result = await signupUser(req.body);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    console.log("로그인 요청");
    console.log("body: ", req.body);

    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const userCreateCode = async (req, res, next) => {
  try {
    console.log("이메일 코드 생성 요청");
    console.log("body: ", req.body);

    const { email } = req.body;
    const { to, code } = sendCodeEmail(email);
    res.status(200).json(response(status.SUCCESS, "이메일 코드 생성 완료"));
  } catch (error) {
    next(error);
  }
};
