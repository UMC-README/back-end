import express from "express";
import expressAsyncHandler from "express-async-handler";
import { tokenAuth } from "../middleware/token.auth.js";
import {
  createRoomsController,
  updateRoomsController,
  deleteRoomsController,
  createPostController,
  updatePostController,
  deletePostController,
  userProfileController,
  userInviteController,
} from "../domains/admin/admin.controller.js";

export const adminRouter = express.Router();

adminRouter.post("/rooms", tokenAuth, expressAsyncHandler(createRoomsController));
adminRouter.patch("/rooms/:room_id", tokenAuth, expressAsyncHandler(updateRoomsController));
adminRouter.patch("/rooms", tokenAuth, expressAsyncHandler(deleteRoomsController));
adminRouter.post("/post", tokenAuth, expressAsyncHandler(createPostController));
adminRouter.patch("/post/:post_id", tokenAuth, expressAsyncHandler(updatePostController));
adminRouter.patch("/post", tokenAuth, expressAsyncHandler(deletePostController));
adminRouter.get("/profile/:userId", tokenAuth, expressAsyncHandler(userProfileController));
adminRouter.get("/invitation/:roomId", tokenAuth, expressAsyncHandler(userInviteController));
