import { writeRecordDao, addPlantDao, representPlantDao, removePlantDao, deadPlantDao, updatePlantInfoDao, getPlantImageDao, deleteRecordDao } from '../models/recordDao.js';
import { deleteS3Object } from '../../config/imageUploader.js';

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writeRecordService = async (user_id, plant_nickname, recordData) => {
    try {
        // 로그 추가하여 데이터 확인
        console.log("writeRecordService - user_id:", user_id);
        console.log("writeRecordService - plant_nickname:", plant_nickname);
        console.log("writeRecordService - recordData:", recordData);

        const result = await writeRecordDao(user_id, plant_nickname, recordData);
        return result;
    } catch (error) {
        console.error("writeRecordService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlantService = async (plantData) => {
    try {
        console.log("Adding plant service called with data:", plantData);
        const result = await addPlantDao(plantData);
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
        // 식물 이미지 URL 조회
        const plantImage = await getPlantImageDao(user_id, plant_nickname);
        console.log("삭제할 식물 이미지 URL:", plantImage);

        // S3에서 파일 삭제
        if (plantImage) {
            const key = plantImage.split(".com/")[1]; // S3 키 추출
            console.log("삭제할 S3 키:", key);
            await deleteS3Object(key);
        }

        // 데이터베이스에서 식물 삭제
        const result = await removePlantDao(user_id, plant_nickname);
        console.log("데이터베이스에서 식물 삭제 결과:", result);
        return result;
    } catch (error) {
        console.error("deletePlantService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름, 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const deadPlantService = async (userId, plantNickname, deadPlantDto) => {
    try {
        const deadPlantData = {
            dead_date: deadPlantDto.dead_date,
            reason: deadPlantDto.reason,
            letter: deadPlantDto.memorial_letter,
        };
        console.log("날짜", deadPlantData.dead_date)
        const result = await deadPlantDao(userId, plantNickname, deadPlantData);
        return result;
    } catch (err) {
        console.error("deadPlantService 중 오류 발생:", err);
        throw err;
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

// 식물일지 삭제
export const deleteRecordService = async (user_id, plant_nickname, date) => {
    try {
        // 로그 추가하여 데이터 확인
        console.log("deleteRecordService - user_id:", user_id);
        console.log("deleteRecordService - plant_nickname:", plant_nickname);
        console.log("deleteRecordService - date:", date);

        const result = await deleteRecordDao(user_id, plant_nickname, date);
        if (result === 0) {
            throw new Error("삭제할 기록이 없습니다.");
        }
        return result;
    } catch (error) {
        console.error("deleteRecordService 중 오류 발생:", error); // 에러 로깅
        throw error;
    }
};