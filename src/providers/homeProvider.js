import { home } from "../models/homeDao.js";

// 홈화면(대표식물 날짜,이미지)
export const homeScreen = async (user_id) => {
    try {
        const result = await home(user_id);
        return result
    } catch (error) {
        throw error;
    }
}