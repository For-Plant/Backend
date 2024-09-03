import { pool } from '../../config/db.connect.js';
import { selectPlantList, selectRecordList,selectPlantInfo, writePlantRecord, selectRecord, insertPlant, deletePlant, selectPlantImage, insertDeadPlant, getPlantId, deleteRepresent, setRepresent, getPlantDetails, updatePlantDetails, getPlantInfo, deletePlantRecord, isRepresentSql, deleteRepresentSql, deleteImageUrlSql } from './recordSql.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';

// 메인 기록화면 : 반려식물 목록
export const getPlantListDao = async (userId) => {
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
export const getRecordListDao = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        
        // 쿼리 파라미터 로그 출력
        console.log("userId:", userId);
        console.log("plantNickname:", plantNickname);

        const [records] = await conn.query(selectRecordList, [userId, plantNickname]);
        const [plantInfo] = await conn.query(selectPlantInfo, [userId, plantNickname]);
        conn.release();

        // plantInfo 로그 출력
        console.log("records:", records);
        console.log("plantInfo:", plantInfo);

        return [records, plantInfo];
    } catch (err) {
        console.error("getRecordList 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};


// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writeRecordDao = async (userId, plantNickname, recordDto) => {
    try {
        const conn = await pool.getConnection();
        // 로그 추가하여 데이터 확인
        console.log("writeRecordDao - userId:", userId);
        console.log("writeRecordDao - plantNickname:", plantNickname);
        console.log("writeRecordDao - recordDto:", recordDto);

        const { content, created_at, updated_at } = recordDto;

        const [result] = await conn.query(writePlantRecord, [userId, userId, plantNickname, content, created_at, updated_at]);
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("writeRecord 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
export const getRecordDao = async (user_id, nickname, date) => {
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

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlantDao = async (plantDto) => {
    try {
        const conn = await pool.getConnection();
        console.log("Executing SQL:", insertPlant, [plantDto.user_id, plantDto.name, plantDto.nickname, plantDto.created_at, plantDto.photo]);
        const [result] = await conn.query(insertPlant, [plantDto.user_id, plantDto.name, plantDto.nickname, plantDto.created_at, plantDto.photo]);
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("addPlant 중 오류 발생:", err); // 에러 로깅
        throw new Error('Internal Server Error');
    }
};

// 대표 식물 지정하기 : 버튼 누르면 representative_plant 테이블에 추가
export const representPlantDao = async (userId, plantNickname) => {
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
export const removePlantDao = async (userId, plantNickname) => {
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

// 식물 이미지 URL 조회
export const getPlantImageDao = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(selectPlantImage, [userId, plantNickname]);
        conn.release();
        return rows[0]?.plant_img || null;
    } catch (err) {
        console.error("getPlantImage 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름 , 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const deadPlantDao = async (userId, plantNickname, deadPlantDto) => {
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
        const [result] = await conn.query(insertDeadPlant, [userId, plantId, deadPlantDto.reason, deadPlantDto.letter, deadPlantDto.dead_date, plantImg]);
        const [isRepresent] = await conn.query(isRepresentSql, [userId, plantId])
        if(isRepresent != 0){
            await conn.query(deleteRepresentSql, [userId, plantId])
        }
        
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error("deadPlant 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const getPlantInfoDao = async (userId, plantNickname) => {
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

// 식물 이미지 삭제 DB
export const deleteImageDao = async (userId, plantNickname) => {
    try {
        const conn = await pool.getConnection();
        const [plant] = await conn.query(deleteImageUrlSql, [userId, plantNickname]);
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
}

// 식물 이름, 날짜 변경 가능
export const updatePlantInfoDao = async (userId, oldPlantNickname, plantData) => {
    try {
        const conn = await pool.getConnection();

        const updates = [];
        const params = [];

        console.log(plantData);

        if (plantData.name) {
            updates.push('plant_name = ?');
            params.push(plantData.name);
        }
        if (plantData.nickname) {
            updates.push('plant_nickname = ?');
            params.push(plantData.nickname);
        }
        if (plantData.created_at) {
            updates.push('created_at = ?');
            params.push(plantData.created_at);
        }
        if (plantData.photo) {
            updates.push('plant_img = ?');
            params.push(plantData.photo);
        }

        params.push(userId, oldPlantNickname);

        const query = updatePlantDetails(updates);

        const [result] = await conn.query(query, params);
        conn.release();
        return result;
    } catch (err) {
        console.error("updatePlantInfo 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 데이터베이스에서 기존 이미지 URL을 가져오는 함수
export const getOldImageUrl = async (userId, plantNickname) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT plant_img FROM PLANT WHERE user_id = ? AND plant_nickname = ?',
            [userId, plantNickname]
        );
        conn.release();
        console.log(rows);
        if (rows.length > 0) {
            return rows[0].plant_img;
        } else {
            return null;
        }
    } catch (err) {
        conn.release();
        console.error("데이터베이스에서 기존 이미지 URL을 가져오는 중 오류 발생:", err);
        throw err;
    }
};

// 나의 식물 일지 삭제 : 사용자가 특정 날짜의 식물 기록을 삭제하기
export const deleteRecordDao = async (userId, plantNickname, date) => {
    try {
        const conn = await pool.getConnection();
        // 로그 추가하여 데이터 확인
        console.log("deleteRecordDao - userId:", userId);
        console.log("deleteRecordDao - plantNickname:", plantNickname);
        console.log("deleteRecordDao - date:", date);

        const [result] = await conn.query(deletePlantRecord, [userId, userId, plantNickname, date]);
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error("deleteRecord 중 오류 발생:", err); // 에러 로깅
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

export const getNameDao = async (userId, plantNickname) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT plant_name FROM PLANT WHERE user_id = ? AND plant_nickname = ?',
            [userId, plantNickname]
        );
        conn.release();
        console.log(rows);
        if (rows.length > 0) {
            return rows[0].plant_name;
        } else {
            return null;
        }
    } catch (err) {
        conn.release();
        console.error("데이터베이스에서 기존 식물이름을 가져오는 중 오류 발생:", err);
        throw err;
    }
};