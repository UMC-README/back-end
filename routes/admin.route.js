import express from "express";
import expressAsyncHandler from "express-async-handler";
import { tokenAuth } from "../middleware/token.auth.js";
import { userProfile } from "../domains/admin/admin.controller.js";

export const adminRouter = express.Router();

adminRouter.get("/profile/:user_id", tokenAuth, expressAsyncHandler(userProfile));
