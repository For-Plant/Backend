// mypageController.js

import { getUserInfo, getRepresentPlant, getAlivePlants, getDeadPlants, getDeadPlantDetails } from '../providers/mypageProvider.js'; 
import { updateUser } from '../services/mypageService.js'; 
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 

// 마이페이지 메인 화면
export const getMyPageMainCon = async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.user_id);
        const representPlant = await getRepresentPlant(req.user_id);
        const alivePlants = await getAlivePlants(req.user_id, 2);
        const deadPlants = await getDeadPlants(req.user_id, 2);

        res.send(response(status.SUCCESS, {
            user: userInfo,
            representPlant: representPlant,
            alivePlantsCount: alivePlants.length,
            alivePlants: alivePlants,
            deadPlantsCount: deadPlants.length,
            deadPlants: deadPlants
        }));
    } catch (error) {
        console.error("마이페이지 메인 화면 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 살아있는 식물 목록
export const getAlivePlantsCon = async (req, res) => {
    try {
        const alivePlants = await getAlivePlants(req.user_id);
        res.send(response(status.SUCCESS, alivePlants));
    } catch (error) {
        console.error("살아있는 식물 목록을 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 죽은 식물 목록
export const getDeadPlantsCon = async (req, res) => {
    try {
        const deadPlants = await getDeadPlants(req.user_id);
        res.send(response(status.SUCCESS, deadPlants));
    } catch (error) {
        console.error("죽은 식물 목록을 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 죽은 식물 상세 페이지
export const getDeadPlantDetailsCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const deadPlantDetails = await getDeadPlantDetails(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, deadPlantDetails));
    } catch (error) {
        console.error("죽은 식물 상세 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 선택한 식물의 일지 작성한 날짜 목록 (record의 기능 사용)
export const getRecordDatesCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const recordDates = await getRecordListService(req.user_id, plant_nickname);
        res.send(response(status.SUCCESS, recordDates));
    } catch (error) {
        console.error("선택한 식물의 일지 작성한 날짜 목록을 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 선택한 날짜의 식물 일지 내용 (record의 기능 사용)
export const getRecordContentCon = async (req, res) => {
    try {
        const { plant_nickname, date } = req.query;
        const recordContent = await getRecordService(req.user_id, plant_nickname, date);
        res.send(response(status.SUCCESS, recordContent));
    } catch (error) {
        console.error("선택한 날짜의 식물 일지 내용을 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 사용자 프로필 가져오기
export const getUserProfileCon = async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.user_id);
        const userResponse = {
            member_id: userInfo.member_id,
            nickname: userInfo.nickname,
            profile_img: userInfo.profile_img,
            password: userInfo.password
        };
        res.send(response(status.SUCCESS, userResponse));
    } catch (error) {
        console.error("사용자 프로필 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 사용자 프로필 수정 (이미지 업로드 추가)
export const updateUserCon = async (req, res) => {
    try {
        const updatedData = {
            nickname: req.body.nickname,
            profile_img: req.file ? req.file.location : null // 업로드된 파일 URL
        };
        const result = await updateUser(req.user_id, updatedData);
        res.send(result);
    } catch (error) {
        console.error("사용자 프로필 수정 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};
