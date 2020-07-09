import models from '../models';

import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE, RESULT_SUCCESS } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
/**
 * 获取任务类型
 */
export const taskTypes = async () => {
    let result = await models.task_type.findAll(
        {
            raw: true
        }
    );
    return {
        code: RESULT_SUCCESS, data: result
    };
};
/**
 * 获取任务模块
 */
export const taskModule = async (param) => {
    let result = await models.task_module.findAll(
        {
            where: {
                task_type_id: param.task_type
            },
            raw: true
        }
    );
    return {
        code: RESULT_SUCCESS, data: result
    };
};
/**
 * 保存任务
 * @param {*} param 
 */
export const saveTask = async (param, token) => {
    let transaction = await models.sequelize.transaction();
    try {
        let rowDate = parseInt(new Date().getTime() / 1000);
        let predict_start_time = Number(param.predict_start_time) / 1000 || null;
        let predict_end_time = Number(param.predict_end_time) / 1000 || null;
        let reality_start_time = Number(param.reality_start_time) / 1000 || null;
        let reality_end_time = Number(param.reality_end_time) / 1000 || null;
        let task = await models.task.create({
            project_id: param.project_id,
            task_type: param.task_type,
            module_id: param.module_id,
            task_name: param.task_name,
            task_detail: param.task_detail,
            task_user_id: token.uid,
            task_username: token.userName,
            create_time: rowDate,
            state: param.state,
            acceptor_id: param.acceptor_id,
            acceptor_username: param.acceptor_username,
            manage_id: param.manage_id,
            manage_name: param.manage_name,
            predict_start_time: predict_start_time,
            predict_end_time: predict_end_time,
            reality_start_time: reality_start_time,
            reality_end_time: reality_end_time,
        }, transaction);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存成功" };
    } catch (error) {
        console.log("保存任务出错", error);
        await transaction.rollback();
        return { code: DB_ERROR_CODE, msg: "保存错误" };
    }

};
/**
 * 更新任务
 * @param {*} param 
 */
export const updateTask = async (param, token) => {
    let transaction = await models.sequelize.transaction();
    try {
        let rowDate = parseInt(new Date().getTime() / 1000);
        let predict_start_time = Number(param.predict_start_time) / 1000 || null;
        let predict_end_time = Number(param.predict_end_time) / 1000 || null;
        let reality_start_time = Number(param.reality_start_time) / 1000 || null;
        let reality_end_time = Number(param.reality_end_time) / 1000 || null;
        let task = await models.task.update({
            task_type: param.task_type,
            module_id: param.module_id,
            task_name: param.task_name,
            task_detail: param.task_detail,
            state: param.state,
            acceptor_id: param.acceptor_id,
            acceptor_username: param.acceptor_username,
            manage_id: param.manage_id,
            manage_name: param.manage_name,

            predict_start_time: predict_start_time,
            predict_end_time: predict_end_time,
            reality_start_time: reality_start_time,
            reality_end_time: reality_end_time,
        }, {
            where: {
                id: param.id
            },
            transaction
        });
        await models.file.destroy({
            where: {
                task_id: param.id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存成功" };
    } catch (error) {
        console.log("更新任务出错", error);
        await transaction.rollback();
        return { code: DB_ERROR_CODE, msg: "保存错误" };
    }

};
/**
 * 查询任务
 * @param {*} param 
 */
export const searchTask = async (param) => {
    let sql = ` SELECT t1.*,t2.type_name,t3.module_name FROM task t1 LEFT JOIN task_type t2 ON t2.id=t1.task_type LEFT JOIN task_module t3 ON t3.id=t1.module_id  `;
    let sqlTotal = ` SELECT count(1) num FROM task t1 LEFT JOIN task_type t2 ON t2.id=t1.task_type LEFT JOIN task_module t3 ON t3.id=t1.module_id `;
    let object = {
        "project_id$=": param.project_id,
        "task_type$=": param.task_type,
        "task_name$l": param.task_name,
        "task_username$l": param.task_username
    },
        sqlMap = {
            "project_id": "t1.project_id",
            "task_type": "t1.task_type",
            "task_name": "t1.task_name",
            "task_username": "t1.task_username"
        };
    let sqlResult = sqlAppent(object, sqlMap, sql);
    sql += sqlResult.sql;
    sqlTotal += sqlResult.sql;
    sql += " order by t1.create_time desc";
    sql += sqlLimit(param.page, param.pageSize);
    let resultList = await models.sequelize.query(sql, { replacements: sqlResult.param, type: models.Sequelize.QueryTypes.SELECT });
    let resultTotal = await models.sequelize.query(sqlTotal, { replacements: sqlResult.param, type: models.Sequelize.QueryTypes.SELECT });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: resultList, total: resultTotal[0].num };
};

/**
 * 查询文件
 * @param {*} param 
 */
export const taskFile = async (param) => {
    let result = await models.file.findAll({
        where: {
            task_id: param.task_id
        },
        raw: true
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 删除任务
 * @param {*} param 
 */
export const deleteTask = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {
        let task = await models.task.destroy({
            where: {
                id: param.id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "删除成功" };
    } catch (error) {
        console.log("删除任务出错", error);
        await transaction.rollback();
        return { code: DB_ERROR_CODE, msg: "删除错误" };
    }

};
/**
 * 验收
 * @param {*} param 
 */
export const checkTask = async (param, token) => {
    await models.task.update;
    let result = await models.task.update({
        check: param.check,
        check_remark: param.check_remark,
        acceptor_id: token.uid,
        acceptor_username: token.userName,
        acceptor_time: (new Date().getTime()) / 1000
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "验收成功", };
};
