import { plantInfo } from "../models/aiDao.js"

// 예측된 식물 정보 불러오기
export const predictPlant = async (data) => {
    try {
        const result = await plantInfo(data);
        return result;
    } catch (error) {
        throw error;
    }
}