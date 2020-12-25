import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from '../util/sqlAppent';


// 添加
export const add = async (param) => {
    if (!param.level || !param.type || !param.check_message) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }

    if (param.level == 2) {
        if (!param.parent_id || !param.num) {
            return { code: RESULT_ERROR, msg: '参数错误' };
        }
    } else {
        param.parent_id = 0;
        param.supplement = '';
        param.num = undefined;
    }
    if (param.sort) {
        // 判读排序是否冲突
        let conflict = await models.check_table_message.findAll({
            where: {
                level: param.level,
                type: param.type,
                parent_id: param.parent_id || 0,
                sort: param.sort
            }, raw: true
        });
        if (conflict && conflict.length) {
            return { code: RESULT_ERROR, msg: '添加错误，顺序冲突' };
        }
    } else {
        // 排序默认往后排
        let max = await models.sequelize.query(` SELECT MAX(sort) sort FROM check_table_message WHERE level=${param.level} AND parent_id=${param.parent_id || 0} AND type=${param.type}  `, { type: models.SELECT });
        if (max && max.length) {
            param.sort = Number(max[0].sort) + 1;
        } else {
            param.sort = 1;
        }
    }


    await models.check_table_message.create({

        level: param.level,

        type: param.type,

        parent_id: param.parent_id || 0,

        sort: param.sort,
        num: param.num || undefined,
        check_message: param.check_message,

        supplement: param.supplement,

    });
    return { code: RESULT_SUCCESS, msg: '添加成功' };
};

// 更新
export const update = async (param) => {
    console.log('=======更新=====', param);
    if (!param.level || !param.check_message, !param.type) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    if (param.level == 2) {
        if (!param.num) {
            return { code: RESULT_ERROR, msg: '参数错误' };
        }

    } else {
        param.parent_id = 0;
        param.supplement = '';
        param.num = undefined;
    }

    if (param.sort) {
        // 判读排序是否冲突
        let conflict = await models.check_table_message.findAll({
            where: {
                level: param.level,
                type: param.type,
                parent_id: param.parent_id || 0,
                sort: param.sort,
                id: { $ne: param.id }
            }, raw: true
        });
        if (conflict && conflict.length) {
            return { code: RESULT_ERROR, msg: '添加错误，顺序冲突' };
        }
    } else {
        // 排序默认往后排
        let max = await models.sequelize.query(` SELECT MAX(sort) sort FROM check_table_message WHERE level=${param.level} AND parent_id=${param.parent_id || 0} AND type=${param.type}  `);
        if (max && max.length) {
            param.sort = Number(max[0].sort) + 1;
        } else {
            param.sort = 1;
        }
    }


    await models.check_table_message.update({
        sort: param.sort,
        num: param.num || undefined,
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
    // 效验是否有子集
    let subset = await models.check_table_message.count({
        where: {
            parent_id: param.id
        }
    });
    if (subset > 0) {
        return { code: RESULT_ERROR, msg: '存在子集，请先删除子集' };
    }
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
 * 查询一级模块数据
 */
export const findPraent = async (param) => {
    param.type = Number(param.type);
    const result = await models.check_table_message.findAll({
        order: [['sort']],
        where: {
            type: param.type,
            level: 1
        },
        raw: true
    });

    return { code: RESULT_SUCCESS, result };
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