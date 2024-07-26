import express from "express";
import expressAsyncHandler from "express-async-handler";

import { fixPost, deleteFixPost, getAllPost } from "../domains/room/room.controller.js";

import { tokenAuth } from "../middleware/token.auth.js";

export const roomRouter = express.Router();

roomRouter.patch("/fixPost", tokenAuth, expressAsyncHandler(fixPost));
roomRouter.delete("/fixPost", tokenAuth, expressAsyncHandler(deleteFixPost));
roomRouter.get("/:roomId/all", tokenAuth, expressAsyncHandler(getAllPost));
