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

// mbti 식물 가져오기
export const mbtiPlant = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select plantname
            from MBTI_PLANT
            where mbti=?
            `, [data]
        );
        console.log(result)
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 소울메이트 식물 업로드
export const soulmateUpload = async (user_id, plantname) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            insert into SOULMATE_PLANT (user_id, soulmate_name)
            values (?, ?)
            `, [user_id, plantname]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 소울메이트 식물 찾기 검사 여부
export const exist_soulmate = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select soulmate_id, soulmate_name
            from SOULMATE_PLANT
            where user_id=?
            `, user_id
        );
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 소울메이트 식물 업데이트 - 원래는 put으로 해야되고 restful에 안맞는다고 하지만 일단 쓴다
export const soulmateUpdate = async (user_id, plantname) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            update SOULMATE_PLANT
            set soulmate_name=?
            where user_id=?
            `, [plantname, user_id]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 내가 최근에 검사한 소울메이트 식물
export const soulmate = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select soulmate_name
            from SOULMATE_PLANT
            where user_id=?
            `, user_id
        );
        conn.release();
        return result;
    } catch (err) {
        console.error('Error executing query:', err);  // 에러 세부 정보 로그 출력
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};