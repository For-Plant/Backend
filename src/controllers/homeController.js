import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { homeScreen, questionList, soulmatePlant } from "../providers/homeProvider.js"
import { soulResult } from "../services/homeService.js"

// 홈화면(대표식물 날짜,이미지)
export const homescreen = async (req, res, next) => {
    try {
        console.log("홈화면(대표식물 날짜,이미지) 조회");
        const user_id = await req.verifiedToken.user_id;
        console.log(user_id)
        const result = await homeScreen(user_id)

        // 내가 최근에 검사한 소울메이트 식물
        const soulmate = await soulmatePlant(user_id)
        console.log("최근 검사 소울메이트 식물 이름:", soulmate)

        // 대표식물 없을 때
        if (result == "") {
            if (soulmate == "") { // 소울메이트 식물 검사 안했을 때
                return res.send(response(status.NO_REPRESENTATIVE_PLANT, {}))
            } else { // 소울메이트 식물 검사 했을 때
                return res.send(response(status.NO_REPRESENTATIVE_PLANT,
                    soulmate[0].soulmate_name))
            }
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


        if (soulmate == "") {
            return res.send(response(status.SUCCESS, {
                "plant_nickname": result[0].plant_nickname,
                "plant_img": result[0].plant_img,
                "plant_id": result[0].plant_id,
                "date": Math.trunc(differenceInDays),
                "soulmate": soulmate
            }))
        } else {
            return res.send(response(status.SUCCESS, {
                "plant_nickname": result[0].plant_nickname,
                "plant_img": result[0].plant_img,
                "plant_id": result[0].plant_id,
                "date": Math.trunc(differenceInDays),
                "soulmate_plant": soulmate[0].soulmate_name
            }))
        }


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

// 소울메이트 결과
export const soulmateResult = async (req, res, next) => {
    try {
        console.log("소울메이트 결과");
        console.log(req.body)
        const user_id = req.verifiedToken.user_id; // 로그인 된 user_id
        console.log(user_id)
        const result = await soulResult(req.body, user_id)

        return res.send(response(status.SUCCESS, result));

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
};