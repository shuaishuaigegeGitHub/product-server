import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from '../util/sqlAppent';


// 添加
export const add = async (param) => {
    await models.check_table_message.create({

        level: param.level,

        type: param.type,

        parent_id: param.parent_id,

        sort: param.sort,
        num: param.num,
        check_message: param.check_message,

        supplement: param.supplement,

    });
    return { code: RESULT_SUCCESS, msg: '添加成功' };
};

// 更新
export const update = async (param) => {
    await models.check_table_message.update({

        sort: param.sort,
        num: param.num,
        check_message: param.check_message,

        supplement: param.supplement,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '修改成功' };
};
// 删除
export const del = async (param) => {
    await models.check_table_message.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '删除成功' };
};

// 根据类型查询验收数据
export const findAll = async (param) => {
    param.type = Number(param.type);
    const result = await models.check_table_message.findAll({
        order: [['sort']],
        where: {
            type: param.type
        },
        raw: true
    });
    let data = [],
        map = {};
    result.forEach(item => {
        if (item.level == 1) {
            data.push(item);
        } else {
            if (map[item.parent_id]) {
                map[item.parent_id].push(item);
            } else {
                map[item.parent_id] = [item];
            }
        }
    });
    data.forEach(item => {
        item.children = map[item.id] || [];
    });
    return { code: RESULT_SUCCESS, data };
};

/**
 * 查询所有分组给demo版会议通知时使用
 *
 */
export const findAllGroup = async () => {
    const result = await models.check_table_message.findAll({
        order: [['sort']],
        raw: true
    });
    const data = {
        program: [], // 程序
        plan: [], // 策划
        painting: []// 美术
    };

    if (!result.length) {
        return { code: RESULT_ERROR, msg: '未配置验收参数' };
    }
    const map = {};
    result.forEach(item => {
        if (item.level == 1) {
            if (item.type == 1) {
                data.program.push(item);
            } else if (item.type == 2) {
                data.plan.push(item);
            } else {
                data.painting.push(item);
            }
        } else {
            item.result = 0;// 结果，1通过，2不通过,0未填写
            if (map[item.parent_id]) {
                map[item.parent_id].push(item);
            } else {
                map[item.parent_id] = [item];
            }
        }
    });
    if (!data.program.length) {
        return { code: RESULT_ERROR, msg: '程序验收参数未配置' };
    }
    if (!data.plan.length) {
        return { code: RESULT_ERROR, msg: '策划验收参数未配置' };
    }
    if (!data.painting.length) {
        return { code: RESULT_ERROR, msg: '美术验收参数未配置' };
    }
    data.program.forEach(item => {
        item.children = map[item.id] || [];
    });
    data.plan.forEach(item => {
        item.children = map[item.id] || [];
    });
    data.painting.forEach(item => {
        item.children = map[item.id] || [];
    });
    return { code: RESULT_SUCCESS, data };
};