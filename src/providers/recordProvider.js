import { getPlantList, getRecordList, getRecord, getPlantInfo } from '../models/recordDao';
import { plantListDTO, recordListDTO, oneRecordDTO, plantDTO } from '../dtos/recordDto';

// 메인 기록화면 : 반려식물 목록
export const getPlantListService = async (user_id) => {
    const result = await getPlantList(user_id);
    return plantListDTO(result);
};

// 식물 관리 : 특정 식물에 대한 날짜 모음, 식물 닉네임, 사진
export const getRecordListService = async (user_id, plant_nickname) => {
    const result = await getRecordList(user_id, plant_nickname);
    return recordListDTO(result);
};

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
export const getRecordService = async (user_id, plant_nickname, date) => {
    const result = await getRecord(user_id, plant_nickname, date);
    return oneRecordDTO(result);
};

// 식물 수정 : 기존에 설정된 식물 정보 가져오기
export const getPlantService = async (user_id, plant_nickname) => {
    const result = await getPlantInfo(user_id, plant_nickname);
    return plantDTO(result);
};
