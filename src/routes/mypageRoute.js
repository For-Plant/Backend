// mypageRoute.js

import express from 'express';
import jwtMiddleware from '../../config/jwtMiddleware.js';
import { imageUploader_profile } from '../../config/imageUploader.js';
import { getMyPageMainCon, getAlivePlantsCon, getDeadPlantsCon, getDeadPlantDetailsCon, getRecordDatesCon, getRecordContentCon, getUserProfileCon, updateUserCon } from '../controllers/mypageController.js';

const mypageRouter = express.Router();

// 마이페이지 메인 화면
mypageRouter.get('/main', jwtMiddleware, getMyPageMainCon);

// 살아있는 식물 목록
mypageRouter.get('/alive-plants', jwtMiddleware, getAlivePlantsCon);

// 죽은 식물 목록
mypageRouter.get('/dead-plants', jwtMiddleware, getDeadPlantsCon);

// 죽은 식물 상세 페이지
mypageRouter.get('/dead-plant-details', jwtMiddleware, getDeadPlantDetailsCon);

// 선택한 식물의 일지 작성한 날짜 목록 (record의 기능 사용)
mypageRouter.get('/record-dates', jwtMiddleware, getRecordDatesCon);

// 선택한 날짜의 식물 일지 내용 (record의 기능 사용)
mypageRouter.get('/record-content', jwtMiddleware, getRecordContentCon);

// 사용자 프로필 가져오기
mypageRouter.get('/profile', jwtMiddleware, getUserProfileCon);

// 사용자 프로필 수정
mypageRouter.put('/profile', jwtMiddleware, updateUserCon);

export default mypageRouter;
