import express from "express";
import jwtMiddleware from "../../config/jwtMiddleware.js"
import { homescreen, question, soulmateResult } from "../controllers/homeController.js";

export const homeRouter = express.Router();

// 홈화면(대표식물 이름,날짜,이미지)
homeRouter.get('/homescreen', jwtMiddleware, homescreen)
// 질문 불러오기
homeRouter.get('/question', jwtMiddleware, question)
// 소울메이트 결과
homeRouter.post('/soulmate-result', jwtMiddleware, soulmateResult)