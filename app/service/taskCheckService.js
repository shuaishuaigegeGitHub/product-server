// 任务验收
import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from '../util/sqlAppent';
import { userMap } from './UserService';
/**
 * 查找当前用户需要验收的任务
 */
export const findCheckTask = async (param, token, heardToken) => {
    let sql = `  SELECT t1.*,t2.product_name,t1.start_time*1000 as start_time,t1.end_time*1000 as end_time FROM task t1 LEFT JOIN product t2 ON t2.id=t1.product_id WHERE t1.status=2 AND t1.check<3 AND t1.acceptor=${token.uid} `;
    if (param.product_id) {
        sql += `AND t1.product_id=${param.product_id}`;
    }
    sql += ' order by  t1.start_time ';
    const result = [];
    const tasks = await models.sequelize.query(sql, { type: models.SELECT });
    if (tasks && tasks.length) {
        const users = await userMap(heardToken);
        const products = {};
        tasks.forEach(item => {
            item.avatar = users[item.executors] ? users[item.executors].avatar : '';
            if (products[item.product_id]) {
                products[item.product_id].tasks.push(item);
            } else {
                products[item.product_id] = { product_id: item.product_id, product_name: item.product_name, tasks: [item] };
            }
        });
        for (const item in products) {
            result.push(products[item]);
        }
    }
    return { code: RESULT_SUCCESS, data: result, msg: '查询成功' };
};
/**
 * 根据产品和执行人查询当前用户需要验收的任务
 */
export const productExecutors = async (param, token, heardToken) => {
    console.log('=======根据产品和执行人查询当前用户需要验收的任务========', param);
    const where = {
        status: 2,
        check: { lt: 3 },
        acceptor: token.uid
    };
    if (param.executors) {
        where.executors = param.executors;
    }
    if (param.product_id) {
        where.product_id = param.product_id;
    }
    const tasks = await models.task.findAll({
        where
    });
    if (tasks && tasks.length) {
        const users = await userMap(heardToken);
        tasks.forEach(item => {
            item.start_time = item.start_time ? item.start_time * 1000 : '';
            item.end_time = item.end_time ? item.end_time * 1000 : '';
            item.avatar = users[item.executors] ? users[item.executors].avatar : '';
        });
    }
    return { code: RESULT_SUCCESS, data: tasks, msg: '查询成功' };
};
/**
 * 验收通过
 */
export const checkAndAdopt = async (param) => {
    await models.task.update({
        check: 3
    }, {
        where: {
            id: param.id,
        }
    });
    return { code: RESULT_SUCCESS, msg: '验收成功' };
};
/**
 * 验收驳回
 */
export const checkAndAdoptNo = async (param) => {
    if (!param.reject_reason) {
        return { code: RESULT_ERROR, msg: '驳回失败，请填写验收理由' };
    }
    await models.task.update({
        status: 1,
        reject_reason: param.reject_reason,
        check: 2
    }, {
        where: {
            id: param.id,
        }
    });
    return { code: RESULT_SUCCESS, msg: '验收驳回成功' };
};