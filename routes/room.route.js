import express from "express";
import expressAsyncHandler from "express-async-handler";

import { fixPost } from "../domains/room/room.controller.js";

export const roomRouter = express.Router();

roomRouter.patch("/fixPost", expressAsyncHandler(fixPost));
