import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param) => {
    await models.lx_file.create({

        id: param.id,

        type: param.type,

        name: param.name,

        path: param.path,

        size: param.size,

        product_id: param.product_id,

        create_time: param.create_time,

    });
    return { code: RESULT_SUCCESS, msg: "添加成功" };
};

//更新
export const update = async (param) => {
    await models.lx_file.update({

        id: param.id,

        type: param.type,

        name: param.name,

        path: param.path,

        size: param.size,

        product_id: param.product_id,

        create_time: param.create_time,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "修改成功" };
};
//删除
export const del = async (param) => {
    await models.lx_file.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除成功" };
};

//查询
export const findAll = async (param) => {
    param.pagesize = Number(param.pagesize);
    param.page = Number(param.page);
    const { count, rows } = await models.lx_file.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where: {

        },
    });
    return { code: RESULT_SUCCESS, count, rows };
};