import { mbtiPlant, soulmateUpload } from "../models/homeDao.js";
import { solution } from "../dtos/homeDto.js"

// 소울메이트 결과
export const soulResult = async (body, user_id) => {
    try {

        const survey = ["EI", "EI", "EI", "SN", "SN", "SN", "TF", "TF", "TF", "JP", "JP", "JP"];
        const choices = [body.EI1, body.EI2, body.EI3, body.SN1, body.SN2, body.SN3, body.TF1, body.TF2, body.TF3, body.JP1, body.JP2, body.JP3]

        // solution 함수를 호출하여 결과를 얻습니다
        const mbtiResult = solution(survey, choices);
        console.log("mbti:", mbtiResult)

        // mbti에 맞는 식물 가져오기
        const plant = await mbtiPlant(mbtiResult)
        console.log("mbtiplant:", plant[0].plantname)

        // mbti soulmate_plant 테이블에 업로드
        const plantUpload = await soulmateUpload(user_id, plant[0].plantname)

        return plant

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}