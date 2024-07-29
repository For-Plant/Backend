// 메인 기록화면 : 살아있는 반려식물 목록
export const selectPlantList = 'SELECT plant_name, plant_nickname '
    + 'FROM PLANT '
    + 'LEFT JOIN PLANT_DEAD ON PLANT.plant_id = PLANT_DEAD.plant_id '
    + 'WHERE PLANT_DEAD.plant_id IS NULL AND PLANT.user_id = ?;';

// 식물 관리 : 특정 식물에 대한 날짜 모음, 식물 닉네임, 사진
export const selectRecordList = 'SELECT PLANT_RECORD.created_at '
    + 'FROM PLANT_RECORD '
    + 'JOIN PLANT ON PLANT_RECORD.plant_id = PLANT.plant_id '
    + 'WHERE PLANT_RECORD.user_id = ? AND PLANT.plant_nickname = ?;';

export const selectPlantInfo = 'SELECT plant_nickname, plant_img '
    + 'FROM PLANT '
    + 'WHERE user_id = ? AND plant_nickname = ?;';

// 나의 식물 일지 작성 : 식물일지를 사용자가 작성시, 그 작성 글을 content에 넣기
export const writePlantRecord = 'INSERT INTO PLANT_RECORD (user_id, plant_id, content, created_at, updated_at) '
    + 'VALUES (?, (SELECT plant_id FROM PLANT WHERE user_id = ? AND plant_nickname = ?), ?, ?, NULL);';

// 나의 식물 일지 확인하기 : 식물 관리 화면에서 날짜를 선택하면 해당 날짜의 일지를 보여주는 것
export const selectRecord = 'SELECT PLANT_RECORD.content '
    + 'FROM PLANT_RECORD '
    + 'JOIN PLANT ON PLANT_RECORD.plant_id = PLANT.plant_id '
    + 'WHERE PLANT_RECORD.created_at = ? AND PLANT.plant_nickname = ? AND PLANT_RECORD.user_id = ?;';

// 식물 추가 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const insertPlant = 'INSERT INTO PLANT (user_id, plant_name, plant_nickname, created_at, plant_img) '
    + 'VALUES (?, ?, ?, ?, ?);';

// 대표 식물 지정하기 : 버튼 누르면 representitive_plant 테이블에 추가
export const getPlantId = 'SELECT plant_id '
    + 'FROM PLANT '
    + 'WHERE user_id = ? AND plant_nickname = ?;';
export const deleteRepresent = 'DELETE FROM REPRESENTATIVE_PLANT '
    + 'WHERE user_id = ?;';
export const setRepresent = 'INSERT INTO REPRESENTATIVE_PLANT (user_id, plant_id) '
    + 'VALUES (?, ?);';

// 식물 삭제 : 버튼 누르면 삭제
export const deletePlant = 'DELETE FROM PLANT '
    + 'WHERE user_id = ? AND plant_nickname = ?;';

// 식물 부고 처리 : 식물 부고처리 버튼 클릭시, -> 식물의 이름 , 식물이 죽은 날짜, 식물이 무지개더미에 들어간 이유, 추모편지
export const getPlantInfo = 'SELECT plant_id, IFNULL(plant_img, NULL) as plant_img '
    + 'FROM PLANT '
    + 'WHERE user_id = ? AND plant_nickname = ?;';
export const insertDeadPlant = 'INSERT INTO PLANT_DEAD (user_id, plant_id, created_at, reason, memorial_letter, plant_img) '
    + 'VALUES (?, ?, ?, ?, ?, ?);';

// 식물 수정 : 식물 이름, 식물 별명, 식물과 만난 날, 식물의 사진
export const getPlantDetails = 'SELECT plant_name, plant_nickname, created_at, IFNULL(plant_img, NULL) as plant_img '
    + 'FROM PLANT '
    + 'WHERE user_id = ? AND plant_nickname = ?;';
export const updatePlantDetails = 'UPDATE PLANT '
    + 'SET plant_name = ?, plant_nickname = ?, created_at = ?, plant_img = ? '
    + 'WHERE user_id = ? AND plant_nickname = ?;';
