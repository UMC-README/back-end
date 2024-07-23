import express from "express";
import expressAsyncHandler from "express-async-handler";

import { userSignUp } from "../domains/user/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/signup", expressAsyncHandler(userSignUp));
