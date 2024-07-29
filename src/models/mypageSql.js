// 메인페이지
// 사용자 정보 가져오기
export const getUserInfoSql = 'SELECT member_id, nickname, profile_img, password FROM USER WHERE user_id = ?';
// 대표 식물 가져오기
export const getRepresentPlantSql = 'SELECT plant_name, plant_nickname, created_at FROM REPRESENTATIVE_PLANT JOIN PLANT ON REPRESENTATIVE_PLANT.plant_id = PLANT.plant_id WHERE user_id = ?';

// 살아있는 식물 목록 가져오기
export const getAlivePlantsSql = 'SELECT plant_name, plant_nickname FROM PLANT LEFT JOIN PLANT_DEAD ON PLANT.plant_id = PLANT_DEAD.plant_id WHERE PLANT_DEAD.plant_id IS NULL AND PLANT.user_id = ? LIMIT ?';

// 죽은 식물 목록 가져오기
export const getDeadPlantsSql = 'SELECT plant_nickname, PLANT.created_at as plant_created_at, PLANT_DEAD.created_at as dead_created_at FROM PLANT JOIN PLANT_DEAD ON PLANT.plant_id = PLANT_DEAD.plant_id WHERE PLANT.user_id = ? LIMIT ?';

// 죽은 식물 상세 정보 가져오기
export const getDeadPlantDetailsSql = 'SELECT plant_nickname, PLANT.created_at as plant_created_at, PLANT_DEAD.created_at as dead_created_at, plant_img, memorial_letter FROM PLANT JOIN PLANT_DEAD ON PLANT.plant_id = PLANT_DEAD.plant_id WHERE PLANT.user_id = ? AND PLANT.plant_nickname = ?';

// 사용자 프로필 수정
export const updateUserProfileSql = 'UPDATE USER SET nickname = ?, profile_img = ? WHERE user_id = ?';
