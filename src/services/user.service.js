import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signupResponseDTO } from "../dtos/user.dto.js";
import { addUser, fetchUserById } from "../models/user.dao.js";

export const joinUser = async (body) => {
    const joinUserData = await addUser({
        'nickname': body.nickname,
        'member_id': body.member_id,
        'password': body.password,
        'phonenum': body.phonenum,
        'marketing_agree': body.marketing_agree,
        'profile_img': body.profile_img
    });

    if (joinUserData == -1) {
        throw new BaseError(status.USER_ALREADY_EXIST);
    } else {
        return signupResponseDTO(await fetchUserById(joinUserData));
    }
};

export const getUserById = async (id) => {
    const user = await fetchUserById(id);
    if (!user) {
        throw new BaseError(status.USER_NOT_FOUND);
    }
    return signupResponseDTO(user);
};
