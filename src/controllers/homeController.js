import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { homeScreen, questionList } from "../providers/homeProvider.js"

// 홈화면(대표식물 날짜,이미지)
export const homescreen = async (req, res, next) => {
    try {
        console.log("홈화면(대표식물 날짜,이미지) 조회");
        const user_id = await req.verifiedToken.user_id;
        console.log(user_id)
        const result = await homeScreen(user_id)

        // 대표식물 없을 때
        if (result == "") {
            return res.send(response(status.NO_REPRESENTATIVE_PLANT, {}))
        }

        // 대표식물 있을 때
        console.log("result:", result)
        // 현재 날짜
        const now = new Date();
        // 주어진 날짜 문자열을 Date 객체로 변환
        const givenDate = new Date(result[0].created_at);
        // 년-월-일 형식으로 변환(ex.2024-07-28)
        const nowFormatted = now.toISOString().split('T')[0];
        const givenDateFormatted = givenDate.toISOString().split('T')[0];
        // 년-월-일 형식 문자열을 다시 Date 객체로 변환(ex.2024-07-28T00:00:00.000Z)
        const nowDateOnly = new Date(nowFormatted);
        const givenDateOnly = new Date(givenDateFormatted);
        // 날짜 차이 계산 (밀리초 단위)
        const differenceInMilliseconds = nowDateOnly - givenDateOnly;
        // 차이를 일단위로 변환
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;
        console.log("differenceInDays:", differenceInDays)
        return res.send(response(status.SUCCESS, {
            "plant_nickname": result[0].plant_nickname,
            "plant_img": result[0].plant_img,
            "plant_id": result[0].plant_id,
            "date": Math.trunc(differenceInDays)
        }))

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
};

// 질문 불러오기
export const question = async (req, res, next) => {
    try {
        console.log("질문 불러오기");
        console.log(req.query)
        const result = await questionList(req.query)

        return res.send(response(status.SUCCESS, result));

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
};