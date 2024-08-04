import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { response } from './config/response.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';

import { userRouter } from './src/routes/userRoute.js'
import mypageRouter from './src/routes/mypageRoute.js';
import recordRouter from './src/routes/recordRoute.js';

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 라우터 설정
app.use('/user', userRouter);
app.use('/mypage', mypageRouter); // 모든 요청을 mypageRouter로 라우팅
app.use('/record', recordRouter);

// 에러 핸들링
app.use((req, res, next) => {
  const err = new BaseError(status.NOT_FOUND);
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  // err.data가 정의되지 않았을 때 기본값 설정
  const status = err.data ? err.data.status : 500; // 기본값으로 500 (Internal Server Error) 사용
  res.status(status).send(response(err.data || { status: 500, message: 'Internal Server Error' }));
});

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});