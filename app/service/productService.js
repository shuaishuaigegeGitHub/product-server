import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param) => {
    await models.product.create({

        id: param.id,

        create_time: param.create_time,

        update_time: param.update_time,

        product_name: param.product_name,

        status: param.status,

        del: param.del,

        provide_id: param.provide_id,

        input_user_id: param.input_user_id,

        plan_manage_id: param.plan_manage_id,

        project_leader: param.project_leader,

        main_course: param.main_course,

        master_beauty: param.master_beauty,

        project_approval_id: param.project_approval_id,

        approval_time: param.approval_time,

        approval_reason: param.approval_reason,

        approval_end_time: param.approval_end_time,

        APPID: param.APPID,

        APPKEY: param.APPKEY,

        initialization: param.initialization,

    });
    return { code: RESULT_SUCCESS, msg: "添加成功" };
};

//更新
export const update = async (param) => {
    await models.product.update({

        id: param.id,

        create_time: param.create_time,

        update_time: param.update_time,

        product_name: param.product_name,

        status: param.status,

        del: param.del,

        provide_id: param.provide_id,

        input_user_id: param.input_user_id,

        plan_manage_id: param.plan_manage_id,

        project_leader: param.project_leader,

        main_course: param.main_course,

        master_beauty: param.master_beauty,

        project_approval_id: param.project_approval_id,

        approval_time: param.approval_time,

        approval_reason: param.approval_reason,

        approval_end_time: param.approval_end_time,

        APPID: param.APPID,

        APPKEY: param.APPKEY,

        initialization: param.initialization,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "修改成功" };
};
//删除
export const del = async (param) => {
    await models.product.destroy({
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
    const { count, rows } = await models.product.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where: {

        },
    });
    return { code: RESULT_SUCCESS, count, rows };
};