import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const { EMAIL_SERVICE: service, EMAIL_USER: user, EMAIL_PASSWORD: pass } = process.env;

export const sendCodeEmail = (to) => {
  const code = uuidv4().slice(0, 6);
  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
    to,
    subject: "READ.ME 회원가입 인증 코드입니다.",
    text: `인증 코드: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error(error);
    }
  });
  return { to, code };
};
