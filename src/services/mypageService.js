import { updateUserDao } from '../models/mypageDao.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import crypto from 'crypto';

// 사용자 프로필 수정하기
export const updateUser = async (user_id, updatedData) => {
    try {
        // 비밀번호 암호화
        if (updatedData.password) {
            updatedData.password = await crypto
                .createHash("sha256")
                .update(updatedData.password)
                .digest("hex");
        }

        await updateUserDao(user_id, updatedData);
        return response(status.SUCCESS, {});
    } catch (error) {
        console.error("사용자 프로필 수정 중 오류 발생:", error);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};