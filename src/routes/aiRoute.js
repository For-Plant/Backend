import express from "express";
import { predict } from "../controllers/aiController.js";

export const aiRouter = express.Router();

// 파일 업로드 및 예측 처리
aiRouter.post('/ai-camera', predict);

