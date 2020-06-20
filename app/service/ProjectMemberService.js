import models from '@app/models/index';
import dayjs from 'dayjs';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE } from '@app/constants/ResponseCode';

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
    memberList.forEach(item => { item.create_time = now });
    await models.project_member.bulkCreate(memberList);
};
