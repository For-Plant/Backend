import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { predictImage } from "../services/aiService.js";

export const predict = async (req, res) => {
    try {
        const imagePath = req.body.imagePath; // 클라이언트가 요청 본문으로 이미지 경로를 보냄
        const prediction = await predictImage(); 
        console.log("prediction:",prediction)
        return res.send(response(status.SUCCESS, prediction));
    } catch (error) {
        console.error("Error acquiring connection:", error);
    }
};
