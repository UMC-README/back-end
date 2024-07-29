import express from "express";
import expressAsyncHandler from "express-async-handler";

import {
  getUserFixedPost,
  userConfirmCode,
  userCreateCode,
  getMyProfile,
  userLogin,
  userSignUp,
  uploadImage,
  getUserCreateRoom,
  getUserJoinRoom,
  userKakaoLogin,
  getUserRoomProfiles,
  updateUserBasicProfile,
} from "../domains/user/user.controller.js";
import { tokenAuth } from "../middleware/token.auth.js";
import { imageUploader } from "../middleware/image.uploader.js";

export const userRouter = express.Router();

userRouter.post(
  "/s3/upload",
  tokenAuth,
  imageUploader.single("file"),
  expressAsyncHandler(uploadImage)
);

userRouter.post("/signup", expressAsyncHandler(userSignUp));

userRouter.post("/login", expressAsyncHandler(userLogin));

userRouter.post("/login/kakao", expressAsyncHandler(userKakaoLogin));

userRouter.post("/create-code", expressAsyncHandler(userCreateCode));

userRouter.post("/confirm-code", expressAsyncHandler(userConfirmCode));

userRouter.get("/", tokenAuth, expressAsyncHandler(getMyProfile));

userRouter.get("/fixed", tokenAuth, expressAsyncHandler(getUserFixedPost));

userRouter.get("/create-room", tokenAuth, expressAsyncHandler(getUserCreateRoom));

userRouter.get("/join-room", tokenAuth, expressAsyncHandler(getUserJoinRoom));

userRouter.get("/profile", tokenAuth, expressAsyncHandler(getUserRoomProfiles));

userRouter.patch("/profile", tokenAuth, expressAsyncHandler(updateUserBasicProfile));
