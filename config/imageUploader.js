import { S3Client } from "@aws-sdk/client-s3"
import path from "path"
import multer from "multer"
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

