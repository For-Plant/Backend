import express from "express";
import jwtMiddleware from "../config/jwtMiddleware.js";
import { getPlantListCon, getRecordListCon, writeRecordCon, getRecordCon, addPlantCon, representPlantCon, deletePlantCon, deadPlantCon, getPlantCon, updatePlantCon } from "../controllers/recordController.js";
import { imageUploader_plant } from "../config/imageUploader.js";

const recordRouter = express.Router();

// 메인 기록화면 : 반려식물 목록
recordRouter.get('/plant-list', jwtMiddleware, getPlantListCon);

// 식물 관리 : 특정 식물에 대한 날짜 모음, 식물 닉네임, 사진
recordRouter.get('/record-list', jwtMiddleware, getRecordListCon);

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
recordRouter.post('/write-record', jwtMiddleware, writeRecordCon);

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
recordRouter.get('/get-content', jwtMiddleware, getRecordCon);

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
recordRouter.post('/add-plant', jwtMiddleware, imageUploader_plant.single('plant_img'), addPlantCon);

// 대표 식물 지정하기 : 버튼 누르면 representitive_plant 테이블에 추가
recordRouter.post('/represent-plant', jwtMiddleware, representPlantCon);

// 식물 삭제 : 버튼 누르면 삭제
recordRouter.delete('/delete-plant', jwtMiddleware, deletePlantCon);

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름, 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
recordRouter.post('/dead-plant', jwtMiddleware, deadPlantCon);

// 식물 수정 : 기존에 설정된 식물 정보 가져오기
recordRouter.get('/plant', jwtMiddleware, getPlantCon);

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
recordRouter.put('/plant', jwtMiddleware, imageUploader_plant.single('plant_img'), updatePlantCon);

export default recordRouter;
