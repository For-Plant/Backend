import express from "express";
import multer from 'multer';
import { imageUploader_profile } from "../../config/imageUploader.js"
import addUserIdMiddleware from "../middlewares/addUserIdMiddleware.js";
import jwtMiddleware from "../../config/jwtMiddleware.js"
import { allUser, userSignup, findId, changePw, overlapId, login } from "../controllers/userController.js";

export const userRouter = express.Router();

// 전체 유저 조회
userRouter.get('/users', jwtMiddleware, allUser)
// 회원가입
userRouter.post('/sign-up', 
    express.urlencoded({ extended: true }), // form 데이터 처리
    addUserIdMiddleware, // `user_id`를 `req`에 추가
    imageUploader_profile.single("image"), userSignup);
// 로그인 - jwt token 발급
userRouter.post('/login', login)
// 아이디 중복확인
userRouter.get('/overlap-id', overlapId)
// 아이디 찾기
userRouter.post('/find-id', findId)
// 비밀번호 변경
userRouter.put('/change-pw', changePw)
// 로그아웃
