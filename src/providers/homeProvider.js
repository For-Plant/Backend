import { home, question } from "../models/homeDao.js";

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