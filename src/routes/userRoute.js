// routes/user.route.js
import express from "express";
import { userSignin } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post('/signin', userSignin);