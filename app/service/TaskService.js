import models from '../models';

import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE, RESULT_SUCCESS } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';

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
