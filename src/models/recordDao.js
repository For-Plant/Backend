import pool from '../config/db.connect.js';
import { selectPlantList, selectRecordList, writePlantRecord, selectRecord, insertPlant, updateRepresent, deletePlant, insertDeadPlant, getPlantId, deleteRepresent, setRepresent, getPlantDetails, updatePlantDetails, getPlantInfo } from './recordSql.js';
import { response } from '../config/response.js';
import { status } from '../config/responseStatus.js';

// 메인 기록화면 : 반려식물 목록
export const getPlantList = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(selectPlantList, [userId]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("getPlantList 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 관리 : 특정 식물에 대한 날짜 모음, 식물 닉네임, 사진
export const getRecordList = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        const [records] = await conn.query(selectRecordList, [userId, plantNickname]);
        const [plantInfo] = await conn.query(selectPlantInfo, [userId, plantNickname]);
        conn.release();
        return [records, plantInfo];
    } catch (err) {
        console.error("getRecordList 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writeRecord = async (userId, plantNickname, recordDto) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(writePlantRecord, [userId, userId, plantNickname, recordDto.content, recordDto.created_at]);
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("writeRecord 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
export const getRecord = async (userId, nickname, date) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(selectRecord, [date, nickname, userId]);
        conn.release();
        return [rows[0]];
    } catch (err) {
        console.error("getRecord 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlant = async (userId, plantDto) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(insertPlant, [userId, plantDto.name, plantDto.nickname, plantDto.created_at, plantDto.photo]);
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("addPlant 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 대표 식물 지정하기 : 버튼 누르면 representative_plant 테이블에 추가
export const representPlant = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        // plant_id를 조회
        const [plant] = await conn.query(getPlantId, [userId, plantNickname]);
        if (plant.length === 0) {
            conn.release();
            console.error("식물을 찾을 수 없음"); // 에러 로깅
            throw response(status.NOT_FOUND, { message: '식물을 찾을 수 없습니다.' });
        }
        const plantId = plant[0].plant_id;

        // 이전 대표 식물에서 업데이트 
        await conn.query(deleteRepresent, [userId]);

        const [result] = await conn.query(setRepresent, [userId, plantId]);
        conn.release();
        return result;
    } catch (err) {
        console.error("representPlant 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 삭제 : 버튼 누르면 삭제
export const deletePlant = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(deletePlant, [userId, plantNickname]);
        conn.release();
        return result;
    } catch (err) {
        console.error("deletePlant 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름 , 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const deadPlant = async (userId, plantNickname, deadPlantDto) => {
    try {
        const conn = await pool.getConnection();
        // plant_img가 없으면 null을 반환하도록 
        const [plant] = await conn.query(getPlantInfo, [userId, plantNickname]);
        if (plant.length === 0) {
            conn.release();
            console.error("식물을 찾을 수 없음"); // 에러 로깅
            throw response(status.NOT_FOUND, { message: '식물을 찾을 수 없습니다.' });
        }
        const plantId = plant[0].plant_id;
        const plantImg = plant[0].plant_img || null;

        // 부고처리하기 
        const [result] = await conn.query(insertDeadPlant, [userId, plantId, deadPlantDto.deathDate, deadPlantDto.reason, deadPlantDto.letter, plantImg]);
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("deadPlant 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const getPlantInfo = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        const [plant] = await conn.query(getPlantDetails, [userId, plantNickname]);
        conn.release();
        if (plant.length === 0) {
            console.error("식물을 찾을 수 없음"); // 에러 로깅
            throw response(status.NOT_FOUND, { message: '식물을 찾을 수 없습니다.' });
        }
        return plant[0];
    } catch (err) {
        console.error("getPlantInfo 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

export const updatePlantInfo = async (userId, plantNickname, plantData) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(updatePlantDetails, [plantData.name, plantData.nickname, plantData.created_at, plantData.photo, userId, plantNickname]);
        conn.release();
        return result;
    } catch (err) {
        console.error("updatePlantInfo 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};
