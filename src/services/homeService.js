import { mbtiPlant, soulmateUpload, exist_soulmate, soulmateUpdate } from "../models/homeDao.js";
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
        console.log("mbtiplant:", plant[0])

        // 소울메이트 식물 찾기 검사 한 적 있는지
        const exist = await exist_soulmate(user_id)
        console.log("소울메이트 찾기 검사한 적 있는지:", exist)

        // soulmate_plant에 없는 경우
        if (exist == "") {
            const plantUpload = await soulmateUpload(user_id, plant[0].plantname)
        } else { // 소울메이트 식물 찾기 검사 한 적 있는 경우 -> insert 아닌 update
            const plantUpdate = await soulmateUpdate(user_id, plant[0].plantname)
        }

        // mbti soulmate_plant 테이블에 업로드

        return plant

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}