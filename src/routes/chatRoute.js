import express from "express";
import jwtMiddleware from "../../config/jwtMiddleware.js"
import { startChat, sendMessage, getChatList, getChatMessages } from '../controllers/chatController.js';

export const chatRouter = express.Router();

// 채팅방 생성
chatRouter.post('/start', jwtMiddleware, startChat);
// gpt한테 채팅 전송
chatRouter.post('/send', jwtMiddleware, sendMessage);
// 내 채팅 기록 리스트 불러오기
chatRouter.get('/list', jwtMiddleware, getChatList);
// 특정 채팅방의 메시지 조회
chatRouter.get('/message', jwtMiddleware, getChatMessages);