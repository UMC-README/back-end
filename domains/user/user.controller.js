import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { sendCodeEmail } from "../../utils/email.js";

import {
  getUserProfile,
  loginUser,
  signupUser,
  getMyFixedPost,
  getMyCreateRoom,
  getMyJoinRoom,
} from "./user.service.js";

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

export const getMyProfile = async (req, res, next) => {
  try {
    console.log("내 프로필 조회");

    const userId = req.user.userId;

    const result = await getUserProfile(userId);
    res.status(200).json(response(status.SUCCESS, result));
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

    res.status(200).json(response(status.SUCCESS, "이메일을 확인해주세요."));
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
      res.status(200).json(response(status.SUCCESS, { verified: true }));
      delete verificationCode[email];
    } else {
      res.status(400).json(response(status.WRONG_CODE, { verified: false }));
    }
    res.status(200).json(response(status.SUCCESS, "이메일 코드 생성 완료"));
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    console.log("file", req.file);
    res.status(200).json(response(status.SUCCESS, { image: req.file.location }));
  } catch (error) {
    next(error);
  }
};

export const getUserCreateRoom = async (req, res, next) => {
  try {
    console.log("내가 생성한 공지방 조회");

    const userId = req.user.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 6;

    const result = await getMyCreateRoom(userId, page, pageSize);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getUserJoinRoom = async (req, res, next) => {
  try {
    console.log("내가 입장한 공지방 조회");

    const userId = req.user.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 6;

    const result = await getMyJoinRoom(userId, page, pageSize);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
