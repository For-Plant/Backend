import { createChatRoomDAO, saveMessageDAO, updateRoomTitleDAO, getChatListDAO, getMessageCountByRoomIdDAO, getRecentUpdatedRoomDAO } from '../models/chatDao.js';
import { getGPTResponse, getSummary } from '../../config/gptConnect.js';

export const createChatRoomService = async (userId) => {
    const roomId = await createChatRoomDAO(userId, null); // 방 생성 시 title을 null로 설정
    return roomId;
};

export const sendMessageService = async (userId, message, role = 'user') => {
    // 가장 큰 room_id 조회
    let roomId = await getRecentUpdatedRoomDAO(userId);

    // room_id가 없으면 새로운 방 생성
    if (!roomId) {
        roomId = await createChatRoomDAO(userId, null);
    }

    // 첫 메시지인 경우 GPT 요약을 통해 방 제목 생성
    const messageCount = await getMessageCountByRoomIdDAO(roomId);
    if (messageCount === 0 && role === 'user') {
        const roomTitle = await getSummary(message);
        await updateRoomTitleDAO(roomId, roomTitle);
    }

    // 사용자의 메시지 저장
    await saveMessageDAO(roomId, userId, role, message);

    // GPT 응답 생성 및 저장 (사용자가 메시지를 전송한 경우만)
    if (role === 'user') {
        const gptResponse = await getGPTResponse(message);
        await saveMessageDAO(roomId, userId, 'assistant', gptResponse);
        return gptResponse;
    }

    return message;
};

export const getChatListService = async (userId) => {
    return await getChatListDAO(userId);
}

const checkIfFirstMessage = async (roomId) => {
    const messageCount = await getMessageCountByRoomIdDAO(roomId);
    return messageCount === 0;
};
