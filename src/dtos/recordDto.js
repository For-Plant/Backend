// Plant List DTO
const plantListDTO = (data) => {
    return data.map((item) => ({
        name: item.plant_name,
        nickname: item.plant_nickname,
    }));
};

// Single Plant DTO
const plantDTO = (data) => {
    return {
        name: data.plant_name,
        nickname: data.plant_nickname,
        created_at: data.created_at,
        img: data.plant_img
    };
};

// Record List DTO
const recordListDTO = (data) => {
    const records = data[0];
    const plantInfo = data[1][0];

    return {
        plantName: plantInfo.plant_nickname,
        plantImage: plantInfo.plant_img,
        recordDates: records.map(record => record.created_at)
    };
};

// Single Record DTO
const oneRecordDTO = (data) => {
    const record = data[0];

    return {
        content: record.content
    };
};

// Dead Plant DTO
const deadPlantDTO = (data) => {
    return {
        deathDate: data.created_at,
        reason: data.reason,
        letter: data.memorial_letter,
        img: data.plant_img
    };
};

module.exports = { plantListDTO, plantDTO, recordListDTO, oneRecordDTO, deadPlantDTO };
