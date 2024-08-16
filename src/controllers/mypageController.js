// mypageController.js
import { getRecordListService, getRecordService } from '../providers/recordProvider.js';
import { getUserInfo, getRepresentPlant, getAlivePlants, getDeadPlants, getDeadPlantDetails, getContentService, getUserEditInfo } from '../providers/mypageProvider.js'; 
import { updateUser } from '../services/mypageService.js'; 
import { getProfileImageDao, getMemberIdDao } from '../models/mypageDao.js'
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 
import path from "path";
import { editImage, deleteS3Object, renameS3Object } from '../../config/imageUploader.js';

// 마이페이지 메인 화면
export const getMyPageMainCon = async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.verifiedToken.user_id);
        const representPlant = await getRepresentPlant(req.verifiedToken.user_id);
        const alivePlants = await getAlivePlants(req.verifiedToken.user_id, 2);
        const deadPlants = await getDeadPlants(req.verifiedToken.user_id, 2);

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
        const alivePlants = await getAlivePlants(req.verifiedToken.user_id);
        res.send(response(status.SUCCESS, alivePlants));
    } catch (error) {
        console.error("살아있는 식물 목록을 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 죽은 식물 목록
export const getDeadPlantsCon = async (req, res) => {
    try {
        const deadPlants = await getDeadPlants(req.verifiedToken.user_id);
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
        const deadPlantDetails = await getDeadPlantDetails(req.verifiedToken.user_id, plant_nickname);
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
        const recordDates = await getRecordListService(req.verifiedToken.user_id, plant_nickname);
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
        const record = await getContentService(req.verifiedToken.user_id, plant_nickname, date);
        res.send(response(status.SUCCESS, record));
    } catch (error) {
        console.error("기록을 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 사용자 프로필 가져오기
export const getUserProfileCon = async (req, res) => {
    try {
        const userInfo = await getUserEditInfo(req.verifiedToken.user_id);
        const userResponse = {
            member_id: userInfo.member_id,
            username: userInfo.username,
            profile_img: userInfo.profile_img
        };
        res.send(response(status.SUCCESS, userResponse));
    } catch (error) {
        console.error("사용자 프로필 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 사용자 프로필 수정 (이미지 업로드 추가)
export const updateUserCon = async (req, res) => {
    editImage.single('profile_img')(req, res, async (err) => {
        if (err) {
            console.error("profile_img를 업로드하는 중 오류 발생:", err);
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        const profileData = {
            nickname: req.body.nickname,
            photo: req.file ? req.file.location : null,
            password: req.body.password
        };
        
        try {
            // 프로필 사진 변경
            if (req.file) {
                // 프로필 사진 URL 조회
                const profileUrls = await getProfileImageDao(req.verifiedToken.user_id);
                console.log("삭제할 프로필 사진 URL:", profileUrls);

                if (profileUrls.length > 0) {
                    const profileUrl = profileUrls[0].profile_img; // 배열에서 URL 추출
                    const key = profileUrl.split(".com/")[1]; // S3 키 추출
                    console.log("삭제할 S3 키:", key);
                    await deleteS3Object(key);
                }

                const oldUrl = req.file.location; 
                console.log(oldUrl);
                const oldKey = oldUrl.split('https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/')[1];
                console.log(oldKey);
                const fileExtension = path.extname(oldKey); // 파일 확장자 가져오기

                // member_id를 비동기로 가져옴
                const memberIdResult = await getMemberIdDao(req.verifiedToken.user_id);
                const member_id = memberIdResult[0][0].member_id;
                console.log(member_id);
                const newKey = `profile/${member_id}${fileExtension}`;
                console.log(`newKey: ${newKey}`);
                console.log(`oldKey: ${oldKey}`);
                
                await renameS3Object(oldKey, newKey);
                profileData.photo = `https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/${newKey}`;
            }

            const result = await updateUser(req.verifiedToken.user_id, profileData);
            res.send(response(status.SUCCESS, result));
        } catch (error) {
            console.error("프로필 정보를 업데이트하는 중 오류 발생:", error);
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};