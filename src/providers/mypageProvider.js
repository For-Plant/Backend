import { getUserInfoDao, getRepresentPlantDao, getAlivePlantsDao, getDeadPlantsDao, getDeadPlantDetailsDao } from '../models/mypageDao.js';
import { userDTO, plantDTO, deadPlantDTO } from '../dtos/mypageDto.js';

// 사용자 정보 가져오기
export const getUserInfo = async (user_id) => {
    const userInfo = await getUserInfoDao(user_id);
    return userDTO(userInfo);
};

// 대표 식물 가져오기
export const getRepresentPlant = async (user_id) => {
    const representPlant = await getRepresentPlantDao(user_id);
    return plantDTO(representPlant);
};

// 살아있는 식물 목록 가져오기
export const getAlivePlants = async (user_id, limit) => {
    const alivePlants = await getAlivePlantsDao(user_id, limit);
    return alivePlants.map(plantDTO);
};

// 죽은 식물 목록 가져오기
export const getDeadPlants = async (user_id, limit) => {
    const deadPlants = await getDeadPlantsDao(user_id, limit);
    return deadPlants.map(deadPlantDTO);
};

// 죽은 식물 상세 정보 가져오기
export const getDeadPlantDetails = async (user_id, plant_nickname) => {
    const deadPlantDetails = await getDeadPlantDetailsDao(user_id, plant_nickname);
    return deadPlantDTO(deadPlantDetails);
};
