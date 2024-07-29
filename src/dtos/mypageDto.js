// mypageDto.js

// 유저 프로필 수정
export const userDTO = (data) => {
    return {
        member_id: data.member_id,
        nickname: data.nickname,
        profile_img: data.profile_img,
        password: data.password
    };
};

// 반려 식물
export const plantDTO = (data) => {
    return {
        name: data.plant_name,
        nickname: data.plant_nickname,
        created_at: data.created_at,
        img: data.plant_img
    };
};

// 죽은 식물
export const deadPlantDTO = (data) => {
    return {
        nickname: data.plant_nickname,
        plant_created_at: data.plant_created_at,
        dead_created_at: data.dead_created_at,
        img: data.plant_img,
        letter: data.memorial_letter
    };
};
