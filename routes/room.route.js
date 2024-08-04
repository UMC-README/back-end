import express from "express";
import expressAsyncHandler from "express-async-handler";

import {
  fixPost,
  deleteFixPost,
  getAllPost,
  getNotCheckedPost,
  getDetailedPost,
  getComments,
  postComment,
  deleteComment,
  getSubmitRequirements,
} from "../domains/room/room.controller.js";

import { tokenAuth } from "../middleware/token.auth.js";

export const roomRouter = express.Router();

roomRouter.patch("/fixPost", tokenAuth, expressAsyncHandler(fixPost));
roomRouter.delete("/fixPost", tokenAuth, expressAsyncHandler(deleteFixPost));
roomRouter.get("/:roomId/all", tokenAuth, expressAsyncHandler(getAllPost));
roomRouter.get("/:roomId/notChecked", tokenAuth, expressAsyncHandler(getNotCheckedPost));
roomRouter.get("/post/:postId", tokenAuth, expressAsyncHandler(getDetailedPost));
roomRouter.get("/post/:postId/comment", tokenAuth, expressAsyncHandler(getComments));
roomRouter.post("/post/:postId/comment", tokenAuth, expressAsyncHandler(postComment));
roomRouter.delete("/post/comment/:commentId", tokenAuth, expressAsyncHandler(deleteComment));
roomRouter.get("/post/:postId/submit", tokenAuth, expressAsyncHandler(getSubmitRequirements));
