import { writeRecordDao, addPlantDao, representPlantDao, removePlantDao, deadPlantDao, updatePlantInfoDao } from '../models/recordDao.js';

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writeRecordService = async (user_id, plant_nickname, recordData) => {
    try {
        const result = await writeRecordDao(user_id, plant_nickname, recordData);
        return result;
    } catch (error) {
        console.error("writeRecordService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlantService = async (user_id, plantData) => {
    try {
        const result = await addPlantDao(user_id, plantData);
        return result;
    } catch (error) {
        console.error("addPlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 대표 식물 지정하기 : 버튼 누르면 representative_plant 테이블에 추가
export const representPlantService = async (user_id, plant_nickname) => {
    try {
        const result = await representPlantDao(user_id, plant_nickname);
        return result;
    } catch (error) {
        console.error("representPlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 삭제 : 버튼 누르면 삭제
export const deletePlantService = async (user_id, plant_nickname) => {
    try {
        const result = await removePlantDao(user_id, plant_nickname);
        return result;
    } catch (error) {
        console.error("deletePlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름, 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const deadPlantService = async (user_id, plant_nickname, deadData) => {
    try {
        const result = await deadPlantDao(user_id, plant_nickname, deadData);
        return result;
    } catch (error) {
        console.error("deadPlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const updatePlantService = async (user_id, plant_nickname, plantData) => {
    try {
        const result = await updatePlantInfoDao(user_id, plant_nickname, plantData);
        return result;
    } catch (error) {
        console.error("updatePlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};
