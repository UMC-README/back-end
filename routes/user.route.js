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
  getUserPassword,
  updateUserPassword,
  updateUserRoomProfile,
  checkUserRoomNicknameDuplicate,
  getLatestPosts,
  getMySubmitList,
  getMyPenaltyPostList,
  deleteImage,
} from "../domains/user/user.controller.js";
import { tokenAuth } from "../middleware/token.auth.js";
import { imageUploader } from "../middleware/s3.js";

export const userRouter = express.Router();

userRouter.post(
  "/s3/upload",
  tokenAuth,
  imageUploader.array("file", 10),
  expressAsyncHandler(uploadImage)
);

userRouter.delete("/s3", tokenAuth, expressAsyncHandler(deleteImage));

userRouter.post("/signup", expressAsyncHandler(userSignUp));

userRouter.post("/login", expressAsyncHandler(userLogin));

userRouter.post("/login/kakao", expressAsyncHandler(userKakaoLogin));

userRouter.post("/create-code", expressAsyncHandler(userCreateCode));

userRouter.post("/confirm-code", expressAsyncHandler(userConfirmCode));

userRouter.get("/", tokenAuth, expressAsyncHandler(getMyProfile));

userRouter.get("/fixed", tokenAuth, expressAsyncHandler(getUserFixedPost));

userRouter.get("/recent", tokenAuth, expressAsyncHandler(getLatestPosts));

userRouter.get("/create-room", tokenAuth, expressAsyncHandler(getUserCreateRoom));

userRouter.get("/join-room", tokenAuth, expressAsyncHandler(getUserJoinRoom));

userRouter.get("/profile", tokenAuth, expressAsyncHandler(getUserRoomProfiles));

userRouter.patch("/profile", tokenAuth, expressAsyncHandler(updateUserBasicProfile));

userRouter.patch("/profile/:roomId", tokenAuth, expressAsyncHandler(updateUserRoomProfile));

userRouter.post(
  "/profile/:roomId/nickname",
  tokenAuth,
  expressAsyncHandler(checkUserRoomNicknameDuplicate)
);

userRouter.post("/password", tokenAuth, expressAsyncHandler(getUserPassword));

userRouter.patch("/password", tokenAuth, expressAsyncHandler(updateUserPassword));

userRouter.get("/rooms/missions/:roomId", tokenAuth, expressAsyncHandler(getMySubmitList));

userRouter.get("/rooms/penalty/:roomId", tokenAuth, expressAsyncHandler(getMyPenaltyPostList));
