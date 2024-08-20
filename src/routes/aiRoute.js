import express from "express";
import multer from "multer";
import path from "path";
import { predict } from "../controllers/aiController.js";
import jwtMiddleware from "../../config/jwtMiddleware.js";

// Multer 설정
const upload = multer({
    dest: 'uploads/', // 파일을 저장할 경로
    limits: { fileSize: 10 * 1024 * 1024 } // 파일 사이즈 제한 (10MB)
});

export const aiRouter = express.Router();

// 식물 이미지 예측 및 식물 정보 전달
aiRouter.post('/ai-camera', jwtMiddleware, upload.single('image'), predict);
