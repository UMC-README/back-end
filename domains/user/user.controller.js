import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { sendCodeEmail } from "../../utils/email.js";

import { getUserProfile, loginUser, signupUser, getMyFixedPost } from "./user.service.js";

export const userSignUp = async (req, res, next) => {
  try {
    console.log("회원가입 요청");
    console.log("body: ", req.body);

    const result = await signupUser(req.body);
    res.status(status.SUCCESS).json(response(status.SUCCESS, result));
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
    res.status(status.SUCCESS).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    console.log("내 프로필 조회");

    const userId = req.user.userId;

    const result = await getUserProfile(userId);
    res.status(status.SUCCESS).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getUserFixedPost = async (req, res, next) => {
  try {
    console.log("고정된 게시글 조회");

    const userId = req.user.userId;

    const result = await getMyFixedPost(userId);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

const verificationCode = {};

export const userCreateCode = async (req, res, next) => {
  try {
    console.log("이메일 코드 생성 요청");
    console.log("body: ", req.body);

    const { email } = req.body;
    const { to, code } = sendCodeEmail(email);
    verificationCode[to] = code;

    res.status(status.SUCCESS).json(response(status.SUCCESS, "이메일을 확인해주세요."));
  } catch (error) {
    next(error);
  }
};

export const userConfirmCode = async (req, res, next) => {
  try {
    console.log("코드 인증 요청");
    console.log("body: ", req.body);

    const { email, code } = req.body;
    const verify = verificationCode[email];

    if (verify === code) {
      res.status(status.SUCCESS).json(response(status.SUCCESS, { verified: true }));
      delete verificationCode[email];
    } else {
      res.status(status.BAD_REQUEST).json(response(status.WRONG_CODE, { verified: false }));
    }
    res.status(200).json(response(status.SUCCESS, "이메일 코드 생성 완료"));
  } catch (error) {
    next(error);
  }
};
