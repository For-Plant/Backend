// mypageController.js
import { getRecordListService, getRecordService } from '../providers/recordProvider.js';
import { getUserInfo, getRepresentPlant, getAlivePlants, getDeadPlants, getDeadPlantDetails, getContentService, getUserEditInfo } from '../providers/mypageProvider.js'; 
import { updateUser } from '../services/mypageService.js'; 
import { getProfileImageDao, getMemberIdDao, deleteImageDao, getNicknameDao } from '../models/mypageDao.js'
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 
import path from "path";
import { editImageProfile, deleteS3Object, renameS3Object } from '../../config/imageUploader.js';

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
    editImageProfile.single('profile_img')(req, res, async (err) => {
        if (err) {
            console.error("profile_img를 업로드하는 중 오류 발생:", err);
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        try {
            // 모든 값이 비어 있는지 확인
            const isEmptyRequest = !req.body.nickname && !req.body.password && !req.file;
            console.log(isEmptyRequest)
            if (isEmptyRequest) {
                // 기존 닉네임을 가져와서 설정
                const originalData = await getNicknameDao(req.verifiedToken.user_id);
                const originalNickname = originalData[0].nickname; // 실제 닉네임 추출
                req.body.nickname = originalNickname;
            }
            // 프로필 데이터를 준비
            const profileData = {
                nickname: req.body.nickname,
                password: req.body.password,
                photo: req.file ? req.file.location : null // 파일이 있는 경우에만 설정
            };

            // 사진이 없는 경우 또는 모든 값이 비어 있는 경우
            if (!req.file || isEmptyRequest) {
                const profileUrls = await getProfileImageDao(req.verifiedToken.user_id);
                if (profileUrls.length > 0 && profileUrls[0].profile_img !== null) {
                    const profileUrl = profileUrls[0].profile_img;
                    const key = profileUrl.split(".com/")[1].split("?")[0]; // S3 키 추출
                    console.log(`삭제할 키: ${key}`);

                    // S3에서 이미지 삭제
                    await deleteS3Object(key);

                    // 데이터베이스에서 프로필 이미지 URL 삭제
                    await deleteImageDao(req.verifiedToken.user_id);
                    profileData.photo = null; // 이미지 삭제 후 null로 설정
                }
            } else {
                // 사진이 있는 경우 (새로 업로드하는 경우)
                const oldUrl = req.file.location;
                const oldKey = oldUrl.split('https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/')[1];
                const fileExtension = path.extname(oldKey);

                const memberIdResult = await getMemberIdDao(req.verifiedToken.user_id);
                const member_id = memberIdResult[0][0].member_id;
                const newKey = `profile/${member_id}${fileExtension}`;

                await renameS3Object(oldKey, newKey);

                const timestamp = new Date().getTime();
                profileData.photo = `https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/${newKey}?timestamp=${timestamp}`;
            }

            // 프로필 정보 업데이트
            const result = await updateUser(req.verifiedToken.user_id, profileData);
            res.send(response(status.SUCCESS, result));
        } catch (error) {
            console.error("프로필 정보를 업데이트하는 중 오류 발생:", error);
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};


