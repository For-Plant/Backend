import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { slugify } from 'transliteration';
import path from "path";
import { imageUploader_plant, renameS3Object, deleteS3Object, editImage } from '../../config/imageUploader.js';
import { getPlantListService, getRecordListService, getRecordService, getPlantService } from '../providers/recordProvider.js';
import { writeRecordService, addPlantService, representPlantService, deletePlantService, deadPlantService, updatePlantService, deleteRecordService } from '../services/recordService.js';
import {getOldImageUrl, getPlantImageDao} from '../models/recordDao.js'

// 메인 기록화면 : 반려식물 목록
export const getPlantListCon = async (req, res) => {
    try {
        const plants = await getPlantListService(req.verifiedToken.user_id);
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
        console.log(plant_nickname)
        const records = await getRecordListService(req.verifiedToken.user_id, plant_nickname);
        // records 로그 출력
        console.log("records:", records);
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

        // 로그 추가하여 데이터 확인
        console.log("writeRecordCon - plant_nickname:", plant_nickname);
        console.log("writeRecordCon - recordData:", recordData);

        const record = await writeRecordService(req.verifiedToken.user_id, plant_nickname, recordData);
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
        const record = await getRecordService(req.verifiedToken.user_id, plant_nickname, date);
        res.send(response(status.SUCCESS, record));
    } catch (error) {
        console.error("기록을 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const addPlantCon = async (req, res, next) => {
    try {
        console.log("식물 추가 요청이 들어왔습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용

        // 토큰에서 user_id와 username을 가져옴
        const { user_id } = req.verifiedToken;
        console.log("user_id:", user_id);
        req.body.user_id = user_id;

        console.log("body:", req.body.user_id);

        // image 처리
        let imageURL;
        if (req.file) {
            imageURL = req.file.location;
        } else {
            imageURL = null;
        }

        const plantData = {
            user_id: user_id,
            name: req.body.name,
            nickname: req.body.nickname,
            created_at: req.body['created-at'],
            photo: imageURL
        };

        const result = await addPlantService(plantData);
        return res.send(response({ isSuccess: true, code: 200, message: "Plant added successfully" }, result));
    } catch (err) {
        console.error("식물 추가 중 오류 발생:", err);
        return res.send(response({ isSuccess: false, code: status.INTERNAL_SERVER_ERROR, message: "Internal Server Error" }, null));
    }
};

// 대표 식물 지정하기 : 버튼 누르면 representitive_plant 테이블에 추가
export const representPlantCon = async (req, res) => {
    try {
        const { plant_nickname } = req.query;
        const result = await representPlantService(req.verifiedToken.user_id, plant_nickname);
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
        const userId = req.verifiedToken.user_id;

        const result = await deletePlantService(userId, plant_nickname);
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
        const result = await deadPlantService(req.verifiedToken.user_id, plant_nickname, deadData);
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
        const plant = await getPlantService(req.verifiedToken.user_id, plant_nickname);
        res.send(response(status.SUCCESS, plant));
    } catch (error) {
        console.error("식물 정보를 가져오는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const updatePlantsCon = async (req, res) => {
    editImage.single('plant_img')(req, res, async (err) => {
        if (err) {
            console.error("식물 이미지를 업로드하는 중 오류 발생:", err);
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        const { plant_nickname } = req.query;
        const plantData = {
            name: req.body.name,
            nickname: req.body.nickname,
            created_at: req.body.created_at,
            photo: req.file ? req.file.location : null
        };
        
        try {
            const oldPlantNickname = plant_nickname;
            console.log(`기존 닉네임: ${oldPlantNickname}`);

            // 식물 이미지 교체 : edit이라고 저장된 사진 이름 변경
            if(req.file){
                // 식물 이미지 URL 조회
                const plantImage = await getPlantImageDao(req.verifiedToken.user_id, plant_nickname);
                console.log("삭제할 식물 이미지 URL:", plantImage);

                if (plantImage) {
                    const key = plantImage.split(".com/")[1]; // S3 키 추출
                    console.log("삭제할 S3 키:", key);
                    await deleteS3Object(key);
                }
                const oldUrl = req.file.location; // req.plant_img 대신 req.file.location 사용
                const oldKey = oldUrl.split('https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/')[1];
                const fileExtension = path.extname(oldKey); // 파일 확장자 가져오기
                const NicknameSlug = slugify(oldPlantNickname, { lower: true, strict: true });
                const newKey = `plant/${req.verifiedToken.user_id}_${NicknameSlug}${fileExtension}`;
                console.log(`newKey: ${newKey}`);
                console.log(`oldKey: ${oldKey}`);
                await renameS3Object(oldKey, newKey);
                plantData.photo = `https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/${newKey}`;
            }

            // 식물 닉네임 교체 : S3 이미지 이름 변경
            if (req.body.nickname) {
                const newNicknameSlug = slugify(req.body.nickname, { lower: true, strict: true });

                // 데이터베이스에서 기존 이미지 URL 가져오기
                let oldImageUrl = await getOldImageUrl(req.verifiedToken.user_id, oldPlantNickname);
                if(plantData.photo){
                    oldImageUrl = plantData.photo;
                }
                if (oldImageUrl) {
                    // URL에서 키 추출
                    const oldKey = oldImageUrl.split('https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/')[1];
                    const fileExtension = path.extname(oldKey); // 파일 확장자 가져오기
                    const newKey = `plant/${req.verifiedToken.user_id}_${newNicknameSlug}${fileExtension}`;
                    console.log(`newKey: ${newKey}`);
                    console.log(`oldKey: ${oldKey}`);

                    await renameS3Object(oldKey, newKey);

                    // 업데이트된 이미지 URL을 plantData에 반영
                    plantData.photo = `https://for-plant-bucket.s3.ap-northeast-2.amazonaws.com/${newKey}`;
                } else {
                    console.error(`기존 키를 데이터베이스에서 찾을 수 없습니다: user_id=${req.verifiedToken.user_id}, plant_nickname=${oldPlantNickname}`);
                }
            }
            const result = await updatePlantService(req.verifiedToken.user_id, oldPlantNickname, plantData);
            res.send(response(status.SUCCESS, result));
        } catch (error) {
            console.error("식물 정보를 업데이트하는 중 오류 발생:", error);
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};




// 나의 식물 일지 삭제 : 사용자가 특정 날짜의 식물 기록을 삭제하기
export const deleteRecordCon = async (req, res) => {
    try {
        const { plant_nickname, date } = req.query;
        const result = await deleteRecordService(req.verifiedToken.user_id, plant_nickname, date);
        res.send(response(status.SUCCESS, { deletedRecords: result }));
    } catch (error) {
        console.error("식물 일지를 삭제하는 중 오류 발생:", error); // 에러 로깅
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};