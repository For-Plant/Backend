import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { response } from './config/response.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';
// 마이페이지 라우터
import mypageRouter from './src/routes/mypageRoute.js';
import recordRouter from './src/routes/recordRoute.js';

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 설정
app.use('/', mypageRouter); // 모든 요청을 mypageRouter로 라우팅
app.use('/', recordRouter);

// 에러 핸들링
app.use((req, res, next) => {
  const err = new BaseError(status.NOT_FOUND);
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.data.status).send(response(err.data));
});

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});
