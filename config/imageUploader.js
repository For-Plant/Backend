import { S3Client, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import path from "path"
import multer from "multer"
import { slugify } from 'transliteration';
import multerS3 from "multer-s3"

const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".PNG",
    ".JPG",
    ".JPEG",
    ".BMP",
];

import { region, accessKeyId, secretAccessKey } from "./s3.js"
export const s3 = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

// 프로필 이미지
export const imageUploader_profile = multer({
    storage: multerS3({
        s3: s3,
        bucket: "for-plant-bucket",
        key: async function (req, file, callback) {

            const uploadDirectory = "profile";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            // imageurl
            callback(null, `${uploadDirectory}/${req.body.member_id}${extension}`);
        },
        acl: "public-read-write",
    }),
});

// 프로필 이미지 -> 식물 이미지로 수정 : const uploadDirectory = "plant";
export const imageUploader_plant = multer({
    storage: multerS3({
        s3: s3,
        bucket: "for-plant-bucket",
        key: async function (req, file, callback) {
            const uploadDirectory = "plant";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            const nickname = slugify(req.body.nickname) // 한글 -> 영어
            // imageurl
            callback(null, `${uploadDirectory}/${req.verifiedToken.user_id}_${nickname}${extension}`);
        },
        acl: "public-read-write",
    }),
})

// 식물 삭제시 s3에서도 삭제
export const deleteS3Object = async (key) => {
    const params = {
        Bucket: "for-plant-bucket",
        Key: key,
    };

    try {
        const data = await s3.send(new DeleteObjectCommand(params));
        console.log('Delete Success! :', data);
    } catch (error) {
        console.error('S3에서 파일 삭제 중 오류 발생:', error);
        throw error;
    }
};

export const renameS3Object = async (oldKey, newKey) => {
    try {
        // 이미지 복사
        await s3.send(new CopyObjectCommand({
            Bucket: "for-plant-bucket",
            CopySource: `for-plant-bucket/${oldKey}`,
            Key: newKey,
            ACL: 'public-read-write'
        }));

        // 기존 이미지 삭제
        await deleteS3Object(oldKey);
    } catch (error) {
        console.error('S3 객체 이름 변경 중 오류 발생:', error);
        throw error;
    }
};

export const editImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: "for-plant-bucket",
        key: async function (req, file, callback) {
            const uploadDirectory = "plant";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            // imageurl
            callback(null, `${uploadDirectory}/${req.verifiedToken.user_id}_edit${extension}`);
        },
        acl: "public-read-write",
    }),
})

export const checkS3ObjectExists = async (key) => {
    try {
        await s3.send(new HeadObjectCommand({
            Bucket: "for-plant-bucket",
            Key: key
        }));
        return true;
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata.httpStatusCode === 404) {
            return false;
        }
        throw error;
    }
};