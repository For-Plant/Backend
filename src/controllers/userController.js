//user.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import crypto from "crypto";


import { checkUser, repeatId, passwordCheck } from "../providers/userProvider.js"
import { joinUser, checkId, checkPw, signIn } from "../services/userService.js";

// 모든 유저 조회
export const allUser = async (req, res, next) => {
    try {
        console.log("모든 유저 조회");
        const result = await checkUser()

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
};
// 회원가입
export const userSignup = async (req, res, next) => {
    try {
        console.log("회원가입을 요청하였습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용
        // image
        var imageURL;
        if (req.file) {
            imageURL = req.file.location;
        } else {
            imageURL = null;
        }
        console.log("imageURL:", imageURL)
        const result = await joinUser(req.body, imageURL)

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

// 아이디 중복 확인
export const overlapId = async (req, res, next) => {
    try {
        console.log("아이디 중복 확인을 요청하였습니다!");
        console.log("query:", req.query); // 값이 잘 들어오나 찍어보기 위한 테스트용
        const result = await repeatId(req.query)
        if (result == undefined) {
            return res.send(response(status.SUCCESS, {}));
        } else {
            return res.send(response(status.LOGIN_ID_EXIST, result));
        }
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}
// id 찾기
export const findId = async (req, res, next) => {
    try {
        console.log("아이디 찾기를 요청하였습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용
        const result = await checkId(req.body)
        console.log("result:", result)
        if (result == undefined) {
            return res.send(response(status.LOGIN_ID_NOT_EXIST, {}));
        } else {
            return res.send(response(status.SUCCESS, result));
        }
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

// 비밀번호 변경
export const changePw = async (req, res, next) => {
    try {
        console.log("비밀번호 변경을 요청하였습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용

        // 아이디 존재하는지 확인
        const result_id = await checkId(req.body)
        console.log("result_id:", result_id)

        if ( result_id == undefined || result_id.member_id != req.body.member_id) {
            return res.send(response(status.LOGIN_ID_NOT_EXIST, {}));
        }

        // 아이디 존재하면 비밀번호 변경
        const result = await checkPw(req.body)
        console.log("result:", result)

        return res.send(response(status.SUCCESS, {}));

    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

// 로그인 - jwt token 발급
export const login = async (req, res, next) => {
    try {
        console.log("로그인(jwt token 발급)을 요청하였습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용
        const userId = await repeatId(req.body);

        if (userId == undefined) {
            return res.send(response(status.LOGIN_ID_EXIST, result));
        }
        // 아이디
        console.log(userId.member_id)

        const selectUserId = userId.member_id;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha256")
            .update(req.body.password)
            .digest("hex");
        // 해시화된 암호
        console.log(hashedPassword);
        const selectUserPasswordParams = [selectUserId, hashedPassword];
        const passwordRows = await passwordCheck(
            selectUserPasswordParams
        );

        if (!passwordRows || passwordRows.password !== hashedPassword) {
            return res.send(response(status.LOGIN_PASSWORD_WRONG, {}));
        }
        console.log("passwordRows.user_id:", passwordRows.user_id)
        const token = await signIn(passwordRows.user_id);
        console.log("token:", token);
        return res.send(response(status.SUCCESS, token));
    } catch (err) {
        console.error("Error acquiring connection:", err);
    }
}

