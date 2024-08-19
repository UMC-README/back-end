import { StatusCodes } from "http-status-codes";

export const status = {
  // success
  SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: 200,
    message: "success!",
  },

  // error
  // common err
  INTERNAL_SERVER_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    isSuccess: false,
    code: "COMMON000",
    message: "서버 에러, 관리자에게 문의 바랍니다.",
  },
  BAD_REQUEST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON001",
    message: "잘못된 요청입니다.",
  },
  UNAUTHORIZED: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "COMMON002",
    message: "권한이 잘못되었습니다.",
  },
  METHOD_NOT_ALLOWED: {
    status: StatusCodes.METHOD_NOT_ALLOWED,
    isSuccess: false,
    code: "COMMON003",
    message: "지원하지 않는 Http Method 입니다.",
  },
  FORBIDDEN: {
    status: StatusCodes.FORBIDDEN,
    isSuccess: false,
    code: "COMMON004",
    message: "금지된 요청입니다.",
  },
  NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    isSuccess: false,
    code: "COMMON005",
    message: "요청한 페이지를 찾을 수 없습니다.",
  },
  WRONG_EXTENSION: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON006",
    message: "잘못된 파일 형식입니다.",
  },
  EMPTY_TOKEN: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "USER000",
    message: "사용자 인증에 실패했습니다.",
  },
  WRONG_CODE: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "USER001",
    message: "잘못된 인증코드 입니다.",
  },
  WRONG_PASSWORD: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "PW001",
    message: "잘못된 비밀번호 입니다.",
  },
  WRONG_DATE_FORMAT: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON007",
    message: "올바르지 않는 날짜 형식입니다.",
  },
  WRONG_STARTDATE_COMPARE: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON008",
    message: "start_date는 현재보다 미래여야 합니다.",
  },
  WRONG_ENDDATE_COMPARE: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON009",
    message: "end_date는 start_date보다 미래여야 합니다.",
  },
  NOT_MY_ROOM: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON010",
    message: "본인의 공지방에 대해서만 조회가 가능합니다.",
  },
  DELETE_FAIL: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON011",
    message: "이미지를 삭제하는데 실패했습니다.",
  },
  NOT_MY_POST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "POST001",
    message: "본인의 공지글에 대해서만 조회가 가능합니다.",
  },
  NOT_FOUND_POST: {
    status: StatusCodes.NOT_FOUND,
    isSuccess: false,
    code: "POST002",
    message: "존재하지 않는 공지글 ID 입니다.",
  },
};
