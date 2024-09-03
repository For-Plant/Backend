import { pool } from "../../config/db.connect.js";
import { createRoomSQL, updateRoomTitleSQL, saveMessageSQL, getMessageCountByRoomIdSQL, getChatMessagesSQL, getChatListSQL, getRecentUpdatedRoomSQL } from './chatSql.js';

export const createChatRoomDAO = async (userId, roomTitle) => {
    try {
        const [result] = await pool.query(createRoomSQL, [userId, roomTitle]);
        return result.insertId; // 생성된 room_id 반환
    } catch (error) {
        throw new Error('채팅방 생성 중 오류 발생');
    }
};

export const updateRoomTitleDAO = async (roomId, roomTitle) => {
    try {
        await pool.query(updateRoomTitleSQL, [roomTitle, roomId]);
    } catch (error) {
        throw new Error('방 제목 업데이트 중 오류 발생');
    }
};

export const saveMessageDAO = async (roomId, userId, role, content) => {
    try {
        await pool.query(saveMessageSQL, [roomId, userId, role, content]);
    } catch (error) {
        throw new Error('메시지 저장 중 오류 발생');
    }
};

export const getMessageCountByRoomIdDAO = async (roomId) => {
    try {
        const [rows] = await pool.query(getMessageCountByRoomIdSQL, [roomId]);
        return rows[0].messageCount;
    } catch (error) {
        throw new Error('메시지 개수 조회 중 오류 발생');
    }
};

export const getChatListDAO = async (userId) => {
    try {
        const [rows] = await pool.query(getChatListSQL, [userId]);
        return rows;
    } catch (error) {
        throw new Error('채팅 기록 리스트 조회 중 오류 발생');
    }
};

export const getChatMessagesDAO = async (userId, roomId) => {
    try {
        const [rows] = await pool.query(getChatMessagesSQL, [userId, roomId]);
        return rows;
    } catch (error) {
        throw new Error('채팅방 메시지 조회 중 오류 발생');
    }
};

// 최근 업데이트된 방 조회
export const getRecentUpdatedRoomDAO = async (userId) => {
    const [rows] = await pool.query(getRecentUpdatedRoomSQL, [userId]);
    return rows[0].room_id || null;
};

