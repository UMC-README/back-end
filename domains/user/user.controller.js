import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { deleteS3 } from "../../middleware/s3.js";
import { sendCodeEmail } from "../../utils/email.js";
import { getKakaoToken, getKakaoUser } from "../../utils/kakao.js";

import {
  getUserProfile,
  loginUser,
  signupUser,
  getMyFixedPost,
  getMyCreateRoom,
  getMyJoinRoom,
  kakaoLoginUser,
  getMyRoomProfiles,
  updateBasicProfile,
  verifyUserPassword,
  updatePassword,
  updateRoomProfile,
  checkRoomDuplicateNickname,
  getLatestPostsInAllRooms,
  getSubmitList,
  getPenaltyPostList,
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

export const userKakaoLogin = async (req, res) => {
  try {
    const { code, platform } = req.query;

    const { access_token } = await getKakaoToken(code);
    const accessToken = platform === "ios" ? code : access_token;

    const userResponse = await getKakaoUser(accessToken);
    if (userResponse.code === -401) {
      return res
        .status(401)
        .json(response(status.UNAUTHORIZED, { message: "유효하지 않은 토큰입니다." }));
    }

    const userExist = await kakaoLoginUser(userResponse.kakao_account.email);

    if (!userExist) {
      await signupUser(
        {
          nickname: userResponse.kakao_account.profile.nickname,
          name: userResponse.kakao_account.name,
          email: userResponse.kakao_account.email,
          password: userResponse.id,
        },
        accessToken
      );
    }
    return res.status(200).json(response(status.SUCCESS, { accessToken }));
  } catch (err) {
    console.log(err);
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
    const files = req.files.map((file) => file.location);
    res.status(200).json(response(status.SUCCESS, { images: files }));
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const s3Response = await deleteS3(req.body.url);

    if (!s3Response) {
      return res.status(400).json(response(status.DELETE_FAIL));
    }

    res.status(200).json(response(status.SUCCESS, { isDeleted: true }));
  } catch (error) {
    next(error);
  }
};

export const getUserRoomProfiles = async (req, res, next) => {
  try {
    console.log("내 프로필 전체 조회");

    const userId = req.user.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 999;

    const result = await getMyRoomProfiles(userId, page, pageSize);
    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const updateUserBasicProfile = async (req, res, next) => {
  try {
    console.log("내 기본 프로필 수정");

    const userId = req.user.userId;
    const { name, nickname, profileImage } = req.body;

    const isSuccess = await updateBasicProfile(userId, name, nickname, profileImage);

    if (isSuccess) {
      res.status(200).json(response(status.SUCCESS, { isSuccess: true }));
    } else {
      res.status(400).json(response(status.BAD_REQUEST, { isSuccess: false }));
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserRoomProfile = async (req, res, next) => {
  try {
    console.log("공지방별 프로필 수정");

    const userId = req.user.userId;
    const roomId = req.params.roomId;
    const { nickname, profileImage } = req.body;

    const isSuccess = await updateRoomProfile(userId, roomId, nickname, profileImage);

    if (isSuccess) {
      res.status(200).json(response(status.SUCCESS, { isSuccess: true }));
    } else {
      res.status(400).json(response(status.BAD_REQUEST, { isSuccess: false }));
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    console.log("내 비밀번호 수정");

    const userId = req.user.userId;
    const { password } = req.body;

    const isSuccess = await updatePassword(userId, password);

    if (isSuccess) {
      res.status(200).json(response(status.SUCCESS, { isSuccess: true }));
    } else {
      res.status(400).json(response(status.BAD_REQUEST, { isSuccess: false }));
    }
  } catch (error) {
    next(error);
  }
};

export const getUserPassword = async (req, res, next) => {
  try {
    console.log("내 비밀번호 확인");

    const userId = req.user.userId;
    const { password } = req.body;

    const isTrue = await verifyUserPassword(userId, password);

    if (isTrue) {
      res.status(200).json(response(status.SUCCESS, { isTrue: true }));
    } else {
      res.status(400).json(response(status.WRONG_PASSWORD, { isTrue: false }));
    }
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

export const checkUserRoomNicknameDuplicate = async (req, res, next) => {
  try {
    console.log("공지방 내 닉네임 중복 확인");

    const roomId = req.params.roomId;
    const { nickname } = req.body;

    const isDuplicate = await checkRoomDuplicateNickname(roomId, nickname);

    res.status(200).json(response(status.SUCCESS, { isDuplicate }));
  } catch (error) {
    next(error);
  }
};

export const getLatestPosts = async (req, res, next) => {
  try {
    console.log("최근 공지글 목록 조회");

    const userId = req.user.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 5;

    const result = await getLatestPostsInAllRooms(userId, page, pageSize);

    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getMySubmitList = async (req, res, next) => {
  try {
    console.log("미션 제출 목록 조회");

    const userId = req.user.userId;
    const roomId = req.params.roomId;

    const result = await getSubmitList(userId, roomId);

    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export const getMyPenaltyPostList = async (req, res, next) => {
  try {
    console.log("공지방마다 페널티 내역 조회");

    const userId = req.user.userId;
    const roomId = req.params.roomId;

    const result = await getPenaltyPostList(roomId, userId);

    res.status(200).json(response(status.SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
