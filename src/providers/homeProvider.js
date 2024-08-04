import { home, question, soulmate } from "../models/homeDao.js";

// 홈화면(대표식물 날짜,이미지)
export const homeScreen = async (user_id) => {
    try {
        const result = await home(user_id);
        return result
    } catch (error) {
        throw error;
    }
}

// 질문 불러오기
export const questionList = async (data) => {
    try {
        const result = await question(data);
        return result
    } catch (error) {
        throw error;
    }
}

// 내가 최근에 검사한 소울메이트 식물
export const soulmatePlant = async (user_id) => {
    try {
        const result = await soulmate(user_id);
        return result
    } catch (error) {
        throw error;
    }
}