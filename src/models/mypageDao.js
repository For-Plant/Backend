import { pool } from '../../config/db.connect.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { getUserInfoSql, getRepresentPlantSql, getAlivePlantsSql, getDeadPlantsSql, getDeadPlantDetailsSql, updateUserProfileSql } from './mypageSql.js';

// 사용자 정보 가져오기
export const getUserInfoDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getUserInfoSql, [user_id]);
        conn.release();
        return rows[0];
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 대표 식물 가져오기
export const getRepresentPlantDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getRepresentPlantSql, [user_id]);
        conn.release();
        return rows[0];
    } catch (err) {
        console.error("대표 식물을 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 살아있는 식물 목록 가져오기
export const getAlivePlantsDao = async (user_id, limit) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getAlivePlantsSql, [user_id, limit]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("살아있는 식물 목록을 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 죽은 식물 목록 가져오기
export const getDeadPlantsDao = async (user_id, limit) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getDeadPlantsSql, [user_id, limit]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("죽은 식물 목록을 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 죽은 식물 상세 정보 가져오기
export const getDeadPlantDetailsDao = async (user_id, plant_nickname) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getDeadPlantDetailsSql, [user_id, plant_nickname]);
        conn.release();
        return rows[0];
    } catch (err) {
        console.error("죽은 식물 상세 정보를 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 사용자 프로필 수정하기
export const updateUserDao = async (user_id, updatedData) => {
    try {
        const conn = await pool.getConnection();
        await conn.query(updateUserProfileSql, [updatedData.nickname, updatedData.profile_img, user_id]);
        conn.release();
    } catch (err) {
        console.error("사용자 프로필 수정 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};
