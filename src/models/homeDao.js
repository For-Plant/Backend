import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 홈화면(대표식물 날짜,이미지)
export const home = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            SELECT a.plant_nickname, a.plant_img, a.created_at, b.plant_id
            FROM PLANT AS a
            INNER JOIN REPRESENTATIVE_PLANT AS b
            ON a.plant_id = b.plant_id
            WHERE b.user_id = ?
            `, [user_id]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 질문 불러오기
export const question = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select question, answer_a, answer_b
            from ALGORITHM_Q
            where al_id=?
            `, [data.num]
        );
        console.log(result)
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};