import { allUser, overlapId,selectUserPassword } from "../models/userDao.js";

// 모든 유저 조회
export const checkUser = async () => {
    try{    
        const result = await allUser();
        return result;
    } catch(error){
        throw error;
    }
}

// 아이디 중복 확인
export const repeatId = async (data) => {
    try{
        const result = await overlapId(data);
        return result;
    } catch (error) {
        throw error;
      }
}

// 비밀번호 확인
export const passwordCheck = async (data) => {
    try {
        console.log(data)
        const result = await selectUserPassword(data);
        return result;
      } catch (error) {
        throw error;
      }
}
