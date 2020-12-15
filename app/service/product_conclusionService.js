import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from '../util/sqlAppent';


// 添加
export const add = async (param) => {
    await models.product_conclusion.create({

        id: param.id,

        product_id: param.product_id,

        seven_days_data: param.seven_days_data,

        product_result: param.product_result,

        market_feedback: param.market_feedback,

        demo_status: param.demo_status,

        experience_status: param.experience_status,

        transfer_operation_status: param.transfer_operation_status,

        question_feedback: param.question_feedback,

        result_show: param.result_show,

        new_breakthrough: param.new_breakthrough,

        reflection_conclusion: param.reflection_conclusion,

        product_extension: param.product_extension,

        product_meeting: param.product_meeting,

        program_code: param.program_code,

        behind_upload: param.behind_upload,

        art_upload: param.art_upload,

    });
    return { code: RESULT_SUCCESS, msg: '添加成功' };
};

// 更新
export const update = async (param) => {
    await models.product_conclusion.update({

        id: param.id,

        product_id: param.product_id,

        seven_days_data: param.seven_days_data,

        product_result: param.product_result,

        market_feedback: param.market_feedback,

        demo_status: param.demo_status,

        experience_status: param.experience_status,

        transfer_operation_status: param.transfer_operation_status,

        question_feedback: param.question_feedback,

        result_show: param.result_show,

        new_breakthrough: param.new_breakthrough,

        reflection_conclusion: param.reflection_conclusion,

        product_extension: param.product_extension,

        product_meeting: param.product_meeting,

        program_code: param.program_code,

        behind_upload: param.behind_upload,

        art_upload: param.art_upload,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '修改成功' };
};
// 删除
export const del = async (param) => {
    await models.product_conclusion.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '删除成功' };
};

// 查询
export const findAll = async (param) => {
    param.pagesize = Number(param.pagesize);
    param.page = Number(param.page);
    const { count, rows } = await models.product_conclusion.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where: {

        },
    });
    return { code: RESULT_SUCCESS, count, rows };
};