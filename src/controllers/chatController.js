import { createChatRoomService, sendMessageService } from '../services/chatService.js';
import { getChatListProvider, getChatMessagesProvider } from '../providers/chatProvider.js';
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 

export const startChat = async (req, res) => {
    try {
        const userId = req.verifiedToken.user_id;

        // 방 생성 시 title을 null로 설정
        const roomId = await createChatRoomService(userId);

        res.send(response(status.SUCCESS, { room_id: roomId }));
    } catch (error) {
        console.error('채팅방 시작 중 오류 발생:', error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.verifiedToken.user_id;

        const responseMessage = await sendMessageService(userId, message);

        res.send(response(status.SUCCESS, { message: responseMessage }));
    } catch (error) {
        console.error('메시지 전송 중 오류 발생:', error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 채팅 기록 리스트 조회
export const getChatList = async (req, res) => {
    try {
        const userId = req.verifiedToken.user_id;
        const chatList = await getChatListProvider(userId);
        res.send(response(status.SUCCESS, chatList));
    } catch (error) {
        console.error('채팅 기록 리스트 조회 중 오류 발생:', error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const { room_title } = req.query;
        const chatMessages = await getChatMessagesProvider(req.verifiedToken.user_id, room_title);

        res.send(response(status.SUCCESS, chatMessages));
    } catch (error) {
        console.error('채팅방 메시지 조회 중 오류 발생:', error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

