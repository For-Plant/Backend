import { pool } from '../../config/db.connect.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { getUserInfoSql, getRepresentPlantSql, getAliveSql, getDeadSql, getDeadPlantDetailsSql, updateUserProfileSql, selectRecord, getProfileUrlSql, getMemberIdSql, getNicknameSql, getUserInfoEditSql, deleteImageSql } from './mypageSql.js';

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
        const [rows] = await conn.query(getAliveSql, [user_id, limit]);
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
        const [rows] = await conn.query(getDeadSql, [user_id, limit]);
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
        const updates = [];
        const params = [];
    
        if (updatedData.nickname) {
            updates.push('nickname = ?');
            params.push(updatedData.nickname);
        }
    
        if (updatedData.photo) {
            updates.push('profile_img = ?');
            params.push(updatedData.photo);
        }

        if (updatedData.password) {
            updates.push('password = ?');
            params.push(updatedData.password);
        }
    
        params.push(user_id);
        
        const sql = updateUserProfileSql(updates);
        
        // 생성된 SQL 문자열과 매개변수를 사용하여 쿼리 실행
        await conn.query(sql, params);
        conn.release();
    } catch (err) {
        console.error("사용자 프로필 수정 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

export const getContentDao = async (user_id, nickname, date) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(selectRecord, [user_id, nickname, date]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("getRecord 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
};

// 프로필 사진 url 가져오기
export const getProfileImageDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getProfileUrlSql,[user_id]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("geProfileImage 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}

export const getMemberIdDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const member_id = await conn.query(getMemberIdSql,[user_id]);
        console.log('member_id dao : ', member_id);
        conn.release();
        return member_id;
    } catch (err) {
        console.error("getMemberId 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}

export const getNicknameDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getNicknameSql,[user_id]);
        conn.release();
        console.log(rows)
        return rows;
    } catch (err) {
        console.error("getMemberId 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}


// 프로필 수정 가져오기
export const getUserInfoEditDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getUserInfoEditSql, [user_id]);
        conn.release();
        return rows[0];
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

//프로필 사진 삭제
export const deleteImageDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(deleteImageSql, [user_id]);
        conn.release();
        return rows[0];
    } catch (err){
        console.error("사진 삭제 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
}