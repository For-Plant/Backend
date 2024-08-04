import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import crypto from "crypto";
import jwt from "jsonwebtoken"
// env
import dotenv from 'dotenv';
// 루트에서 환경변수 불러옴
dotenv.config({ path: "../.env" });
const jwtsecret = process.env.JWT_SECRET;

import { addUser, findId,changePw } from "../models/userDao.js";

// 회원가입
export const joinUser = async (body,imageURL) => {
    // 현재 날짜 시간
    let date = new Date();
    // 비밀번호 암호화
    const hashedPassword = await crypto
        .createHash("sha256")
        .update(body.password)
        .digest("hex");
    console.log("비밀번호 암호화" + hashedPassword);
    try {
        const joinUserData = await addUser({
            username: body.username,
            nickname: body.nickname,
            member_id: body.member_id,
            password: hashedPassword,
            phonenum: body.phonenum,
            marketing_agree: body.marketing_agree,
            created_at: date,
            updated_at: date,
            profile_img: imageURL,
        });

        if (joinUserData == -1) { // ?
            throw new BaseError(status.USER_ALREADY_EXIST);
        } else {
            return joinUserData;
        }
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
};

// 아이디 찾기
export const checkId = async (body) => {
    try {
        const result = await findId({
            phonenum: body.phonenum,
            username: body.username
        });
        return result;
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

// 비밀번호 변경
export const checkPw = async (body) => {
    // 현재 날짜 시간
    let date = new Date();

    // 비밀번호 암호화
    const hashedPassword = await crypto
        .createHash("sha256")
        .update(body.password)
        .digest("hex");
    console.log("비밀번호 암호화" + hashedPassword);
    try {
        const result = await changePw({
            member_id: body.member_id,
            phonenum: body.phonenum,
            username: body.username,
            date: date,
            password: hashedPassword
        });
        return result;
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

// 로그인(jwt token 발급)
export const signIn = async (user_id) => {
    try {
        //토큰 생성 Service
        let token = await jwt.sign(
          {
            user_id: user_id,
          }, // 토큰의 내용(payload)
          jwtsecret, // 비밀키
          {
            expiresIn: "1d",
            subject: "userInfo",
          } // 유효 기간 1일
        );
        console.log("jwtsecret:",jwtsecret)
        return token;
      } catch (err) {
        console.error("Error acquiring connection:", err);
      }
}