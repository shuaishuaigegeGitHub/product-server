import models from '../models';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { objTimeFormater } from '@app/util/timeUtil';
import _ from 'lodash';

export const query = async (id) => {
    let project = await models.project.findByPk(id);
    return objTimeFormater(project);
};

/**
 * 新增项目
 * @param {object} params 
 */
export const add = async (params) => {
    let { group_id, list_id, project_name, project_logo, begin_time, priority, tag, pos, remark, create_by } = params;
    if (!group_id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请选择所属分组');
    }
    if (!list_id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请选择所属列表');
    }
    if (!project_name) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请输入项目名称');
    }
    if (!project_logo) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请上传项目logo');
    }
    if (begin_time) {
        begin_time = dayjs(begin_time).unix();
    }
    let result = await models.project.create({
        group_id,
        list_id,
        project_name,
        project_logo,
        begin_time,
        priority,
        tag: _.join(tag, ','),
        pos,
        remark: remark || '',
        create_by
    });
    if (!result) {
        throw new GlobalError(DB_ERROR_CODE, '添加项目分组失败');
    }
    return result;
};

/**
 * 删除项目
 * @param {number} id 项目ID
 */
export const del = async (id) => {
    // 把该项目放到回收站
    await models.project.update({
        group_id: 0,
        list_id: 0,
        state: 0,
        update_time: dayjs().unix()
    }, {
        where: {
            id: id
        },
    });
};

/**
 * 更新项目
 * @param {object} params 
 */
export const update = async (params) => {
    let { id, group_id, list_id, project_name, project_logo, begin_time, priority, tag, pos, remark } = params;
    if (!id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
    }
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    await project.update({
        group_id,
        list_id,
        project_name,
        project_logo,
        begin_time,
        priority,
        tag,
        pos,
        remark
    });
};