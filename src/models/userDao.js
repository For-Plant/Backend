import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertUserSql } from "./user.sql.js";

// 전체 유저 조회
export const allUser = async () => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select *
            from USER
            `
        );
        conn.release();
        return result;
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 회원가입
export const addUser = async (data) => {
    try {
        const conn = await pool.getConnection();

        // 존재하는 전화번호인지 확인하는 듯
        // const [confirm] = await conn.query(confirmPhone, [data.phonenum]);

        // if (confirm.length > 0 && confirm[0].isExistPhone) {
        //     conn.release();
        //     return -1;
        // }

        const result = await conn.query(insertUserSql,
            [data.nickname, data.member_id, data.password, data.phonenum, data.marketing_agree, data.created_at, data.updated_at, data.profile_img]);

        conn.release();
        console.log("Dao result:", result[0].insertId)
        return result[0].insertId;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 아이디 찾기
export const findId = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select member_id
            from USER
            where phonenum=? and nickname=?
            `, [data.phonenum, data.nickname]
        );
        conn.release();
        return result[0];
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 비밀번호 변경
export const changePw = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            update USER
            set password=? , updated_at=?
            where member_id=? and phonenum=? and nickname=?
            `, [data.password, data.date, data.member_id, data.phonenum, data.nickname]
        );
        conn.release();
        return result[0];
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 아이디 중복 확인
export const overlapId = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select user_id, member_id
            from USER
            where member_id=?
            `, [data.member_id]
        );
        conn.release();
        console.log("result:", result[0])
        return result[0];
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 비밀번호 확인
export const selectUserPassword = async (data) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(
            `
            select user_id,member_id,password
            from USER
            where member_id=? and password=?
            `,
            [data[0], data[1]]
          );
        conn.release();
        console.log(result)
        return result[0];
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};