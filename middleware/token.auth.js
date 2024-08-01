import jwt from "jsonwebtoken";
import { response } from "../config/response.js";
import { status } from "../config/response.status.js";
import { checkToken, getKakaoUser } from "../utils/kakao.js";
import { findUserByEmail } from "../domains/user/user.dao.js";

export const tokenAuth = async (req, res, next) => {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"];

    const token = header && header.split(" ")[1];

    if (token == null) {
      return res.send(response(status.EMPTY_TOKEN));
    }

    if (!(await checkToken(token))) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
        if (error) {
          return res.send(response(status.FORBIDDEN));
        }
        // 일반 토큰인 경우
        req.user = user;
      });
    } else {
      // 카카오 토큰인 경우
      const response = await getKakaoUser(token);
      if (response.code === -401) {
        // 카카오 토큰이 만료 혹은 잘못된 경우
        return res.send(response(status.UNAUTHORIZED));
      }

      const user = await findUserByEmail(response.kakao_account.email);
      if (!user) {
        // DB에 등록되지 않은 사용자일 경우
        return res.send(response(status.BAD_REQUEST));
      }

      req.user = user.id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
