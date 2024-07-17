import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { confirmPhone, insertUserSql, getUserByIdSql } from "./user.sql.js";

// User 데이터 삽입
export const addUser = async (data) => {
    try {
        const conn = await pool.getConnection();
        
        const [confirm] = await conn.query(confirmPhone, [data.phonenum]);

        if (confirm.length > 0 && confirm[0].isExistPhone) {
            conn.release();
            return -1;
        }

        const result = await conn.query(insertUserSql, [data.nickname, data.member_id, data.password, data.phonenum, data.marketing_agree, data.profile_img]);

        conn.release();
        return result[0].insertId;
        
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// User 데이터 조회
export const fetchUserById = async (id) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(getUserByIdSql, [id]);
        conn.release();
        return result[0];
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};
