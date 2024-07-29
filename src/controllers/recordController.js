import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { imageUploader_plant } from '../../config/imageUploader.js';
import { getPlantListService, getRecordListService, getRecordService, getPlantService } from '../providers/recordProvider.js';
import { writeRecordService, addPlantService, representPlantService, deletePlantService, deadPlantService, updatePlantService } from '../services/recordService.js';

// 메인 기록화면 : 반려식물 목록
export const getPlantListCon = async (req, res) => {
    try {
        const plants = await getPlantListService(req.user_id);
        res.send(response(status.SUCCESS, plants));
    } catch (error) {
        console.error("식물 목록을 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 관리 : 특정 식물에 대한 날짜 모음, 식물 닉네임, 사진
export const getRecordListCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const records = await getRecordListService(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, records));
    } catch (error) {
        console.error("기록 목록을 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writeRecordCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const recordData = req.body;
        const record = await writeRecordService(req.user_id, plant_nickname, recordData);
        res.send(response(status.SUCCESS, { record_id: record }));
    } catch (error) {
        console.error("식물 일지를 작성하는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
export const getRecordCon = async (req, res) => {
    try {
        const { plant_nickname, date } = req.query;
        const record = await getRecordService(req.user_id, plant_nickname, date);
        res.send(response(status.SUCCESS, record));
    } catch (error) {
        console.error("기록을 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlantCon = async (req, res) => {
    imageUploader_plant.single('plant_img')(req, res, async (err) => {
        if (err) {
            console.error("식물 이미지를 업로드하는 중 오류 발생:", err); // 에러 로깅
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        const plantData = {
            name: req.body.name,
            nickname: req.body.nickname,
            created_at: req.body.created_at,
            photo: req.file ? req.file.location : null // 업로드된 파일 URL
        };

        try {
            const plant = await addPlantService(req.user_id, plantData);
            res.send(response(status.SUCCESS, plant));
        } catch (error) {
            console.error("식물을 추가하는 중 오류 발생:", error); // 에러 로깅
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};

// 대표 식물 지정하기 : 버튼 누르면 representitive_plant 테이블에 추가
export const representPlantCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const result = await representPlantService(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error("대표 식물을 지정하는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 삭제 : 버튼 누르면 삭제
export const deletePlantCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const result = await deletePlantService(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error("식물을 삭제하는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름, 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const deadPlantCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const deadData = req.body;
        const result = await deadPlantService(req.user_id, plant_nickname, deadData);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error("식물 부고 처리 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 수정 : 기존에 설정된 식물 정보 가져오기
export const getPlantCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const plant = await getPlantService(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, plant));
    } catch (error) {
        console.error("식물 정보를 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const updatePlantsCon = async (req, res) => {
    imageUploader_plant.single('plant_img')(req, res, async (err) => {
        if (err) {
            console.error("식물 이미지를 업로드하는 중 오류 발생:", err); // 에러 로깅
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        const { plant_nickname } = req.query;
        const plantData = {
            name: req.body.name,
            nickname: req.body.nickname,
            created_at: req.body.created_at,
            photo: req.file ? req.file.location : null // 업로드된 파일 URL
        };

        try {
            const result = await updatePlantService(req.user_id, plant_nickname, plantData);
            res.send(response(status.SUCCESS, result));
        } catch (error) {
            console.error("식물 정보를 업데이트하는 중 오류 발생:", error); // 에러 로깅
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};


