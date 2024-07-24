import express from "express";
import expressAsyncHandler from "express-async-handler";

import { userLogin, userSignUp } from "../domains/user/user.controller.js";
import { tokenAuth } from "../middleware/token.auth.js";

export const userRouter = express.Router();

userRouter.post("/signup", expressAsyncHandler(userSignUp));

userRouter.post("/login", expressAsyncHandler(userLogin));

userRouter.get("/", tokenAuth, expressAsyncHandler(userLogin));
