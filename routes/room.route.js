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
  postSubmit,
  getRoomEntrance,
  postRoomEntrance,
  checkPassword,
  searchPostInRoom,
  checkPenaltyInRoom,
  exiledFromRoom,
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
roomRouter.post("/post/:postId/submit", tokenAuth, expressAsyncHandler(postSubmit));
roomRouter.get("/enter/:url", tokenAuth, expressAsyncHandler(getRoomEntrance));
roomRouter.post("/enter/:roomId", tokenAuth, expressAsyncHandler(postRoomEntrance));
roomRouter.post("/:roomId/checkPassword", tokenAuth, expressAsyncHandler(checkPassword));

roomRouter.get("/:roomId/search", tokenAuth, expressAsyncHandler(searchPostInRoom));

roomRouter.patch("/:roomId/check-penalty", tokenAuth, expressAsyncHandler(checkPenaltyInRoom));
roomRouter.delete("/:roomId/exiled", tokenAuth, expressAsyncHandler(exiledFromRoom));
