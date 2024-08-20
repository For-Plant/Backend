import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { predictImage } from "../services/aiService.js";
import { predictPlant } from "../providers/aiProvider.js";

export const predict = async (req, res) => {
    try {
        const imagePath = req.body.imagePath; // 클라이언트가 요청 본문으로 이미지 경로를 보냄
        // 인공지능 모델 돌리기
        const prediction = await predictImage();
        console.log("prediction:", prediction.predicted_class)
        
        let predicted_plant;
        // 예측된 클래스에 따른 식물 매칭
        if (prediction.predicted_class == 0) {
            predicted_plant = "선인장"
        } else if (prediction.predicted_class == 1) {
            predicted_plant = "드라세나 산드레아나"
        } else if (prediction.predicted_class == 2) {
            predicted_plant = "몬스테라"
        } else if (prediction.predicted_class == 3) {
            predicted_plant = "로즈마리"
        }
        console.log(predicted_plant)
        // 매칭된 식물 불러오기
        const result = await predictPlant(predicted_plant)
        return res.send(response(status.SUCCESS, result[0]));
    } catch (error) {
        console.error("Error acquiring connection:", error);
    }
};
