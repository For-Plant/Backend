// import express from "express";
// import { predict } from "../controllers/aiController.js";

// export const aiRouter = express.Router();

// // 파일 업로드 및 예측 처리 - jwt 추가하기
// aiRouter.post('/ai-camera', predict);

import express from "express";
import multer from "multer";
import path from "path";
import { predict } from "../controllers/aiController.js";

// Multer 설정
const upload = multer({
    dest: 'uploads/', // 파일을 저장할 경로
    limits: { fileSize: 10 * 1024 * 1024 } // 파일 사이즈 제한 (10MB)
});

export const aiRouter = express.Router();

// 파일 업로드 및 예측 처리 - multer 미들웨어 추가
aiRouter.post('/ai-camera', upload.single('image'), predict);
