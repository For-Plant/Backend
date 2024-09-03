import { getChatMessagesDAO } from '../models/chatDao.js';
import { getChatListService } from '../services/chatService.js';

export const getChatListProvider = async (userId) => {
    return await getChatListService(userId);
};

export const getChatMessagesProvider = async (userId, roomId) => {
    return await getChatMessagesDAO(userId, roomId);
};
