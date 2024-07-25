import express from "express";
import expressAsyncHandler from "express-async-handler";

import { userProfile } from "../domains/room_admin/admin.controller.js";

export const adminRouter = express.Router();

adminRouter.get("/profile/:user_id", expressAsyncHandler(userProfile));
