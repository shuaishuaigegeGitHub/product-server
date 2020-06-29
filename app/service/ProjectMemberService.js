import models from '@app/models/index';
import dayjs from 'dayjs';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, RESULT_SUCCESS } from '@app/constants/ResponseCode';

/**
 * 批量插入项目新成员
 * @param {array} memberList 项目成员
 */
export const add = async (memberList) => {
    let now = dayjs().unix();
    if (!memberList || !memberList.length) {
        // 没有参与者参数
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请选择参与者');
    }
    memberList.forEach(item => { item.create_time = now; });
    await models.project_member.bulkCreate(memberList);
};
/**
 * 查找项目参与者
 */

export const searchProjectMember = async (param) => {
    let result = await models.project_member.findAll({
        where: {
            project_id: param.project_id
        },
        raw: true
    });
    return { code: RESULT_SUCCESS, data: result };
};
/**
 * 删除项目参与者
 */

export const deleteProjectMember = async (param) => {
    let result = await models.project_member.destroy({
        where: {
            id: param.id
        },
    });
    return { code: RESULT_SUCCESS, msg: "删除成功" };
};