import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from '../util/sqlAppent';


//添加
export const add = async (param) => {
    await models.game_type.create({

        name: param.name,

    });
    return { code: RESULT_SUCCESS, msg: '添加成功' };
};

//更新
export const update = async (param) => {
    await models.game_type.update({

        name: param.name,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '修改成功' };
};
//删除
export const del = async (param) => {
    await models.game_type.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '删除成功' };
};

//查询
export const findAll = async (param) => {
    param.pagesize = param.pageSize ? Number(param.pageSize) : 1000;
    param.page = param.page ? Number(param.page) : 1;
    let where = {};
    if (param.name) {
        where.name = { $like: '%' + param.name + '%' };
    }
    const { count, rows } = await models.game_type.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where
    });
    return { code: RESULT_SUCCESS, count, rows };
};