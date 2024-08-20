import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 예측된 식물 정보 불러오기
export const plantInfo = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select plantname,plant_feature,plant_environment,how_to_grow,plant_tmi,plant_img
            from MBTI_PLANT
            where plantname=?
            `,[data]
        );
        conn.release();
        return result;
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};
