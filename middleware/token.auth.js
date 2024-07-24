import jwt from "jsonwebtoken";
import { response } from "../config/response.js";
import { status } from "../config/response.status.js";

export const tokenAuth = (req, res, next) => {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"];

    const token = header && header.split(" ")[1];

    if (token == null) {
      return res.send(response(status.EMPTY_TOKEN));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
      if (error) {
        return res.send(response(status.FORBIDDEN));
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
