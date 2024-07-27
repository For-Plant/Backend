import express from "express";
import jwtMiddleware from "../../config/jwtMiddleware.js"
import { homescreen } from "../controllers/homeController.js";

export const homeRouter = express.Router();

// 전체 유저 조회
homeRouter.get('/homescreen', jwtMiddleware, homescreen)