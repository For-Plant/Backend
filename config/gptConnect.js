import axios from 'axios';
import { GPT_CONFIG } from '../config/gpt.js';

export const getGPTResponse = async (message) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${GPT_CONFIG.OPENAI_SECRET_KEY}`,
                    'OpenAI-Organization': GPT_CONFIG.OPENAI_ORGANIZATION,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GPT 응답 오류:', error);
        throw new Error('GPT 응답 중 오류 발생');
    }
};

export const getSummary = async (message) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: '질문을 한 문장으로 요약해 주세요. 이 요약은 채팅방 제목으로 사용될 것입니다.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 20
            },
            {
                headers: {
                    Authorization: `Bearer ${GPT_CONFIG.OPENAI_SECRET_KEY}`,
                    'OpenAI-Organization': GPT_CONFIG.OPENAI_ORGANIZATION,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GPT 요약 생성 중 오류 발생:', error);
        throw new Error('GPT 요약 생성 중 오류 발생');
    }
};

