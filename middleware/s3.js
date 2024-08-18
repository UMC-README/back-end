import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

import { createUUID } from "./uuid.js";

import path from "path";
import dotenv from "dotenv";

import { BaseError } from "../config/error.js";
import { status } from "../config/response.status.js";

dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

// 확장자 검사 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];

export const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      const uuid = createUUID();
      if (!allowedExtensions.includes(extension)) {
        return callback(new BaseError(status.WRONG_EXTENSION));
      }
      callback(null, `${uuid}_${file.originalname}`);
    },
    acl: "public-read-write",
  }),
  // 이미지 용량 제한 (5MB)
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const deleteS3 = async (url) => {
  const key = url.split("//")[1].split("/")[2];
  try {
    await new Promise((resolve, reject) => {
      s3.deleteObject(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
    return true;
  } catch (err) {
    return false;
  }
};
