import express from "express";
import expressAsyncHandler from "express-async-handler";

import { userCreateCode, userLogin, userSignUp } from "../domains/user/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/signup", expressAsyncHandler(userSignUp));

userRouter.post("/login", expressAsyncHandler(userLogin));

userRouter.post("/create-code", expressAsyncHandler(userCreateCode));
