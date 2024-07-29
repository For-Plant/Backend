import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { response } from './config/response.js';
import { BaseError, multerErrorHandler } from './config/error.js';
import status from './config/responseStatus.js';
// 라우터
import mypageRouter from './src/routes/mypageRoute.js';
import recordRouter from './src/routes/recordRoute.js';
// Multer 설정
import upload from './config/multerMiddleware.js';

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 설정
app.use('/mypage', mypageRouter);
app.use('/record', recordRouter);

// 파일 업로드 라우트 예시
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully.');
});

// 404 에러 핸들링
app.use((req, res, next) => {
  const err = new BaseError(status.NOT_FOUND);
  next(err);
});

// Multer 에러 핸들링 미들웨어
app.use(multerErrorHandler);

// 일반 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err); // 에러 스택 트레이스 로깅
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.data?.status || 500).send(response(err.data || status.INTERNAL_SERVER_ERROR, {}));
});

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});

export { upload };
