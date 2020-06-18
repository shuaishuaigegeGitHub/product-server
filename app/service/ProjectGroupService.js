import models from '../models';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE } from '@app/constants/ResponseCode';
import { objTimeFormater } from '@app/util/timeUtil';
import dayjs from 'dayjs';

/**
 * 查询项目组信息
 */
export const query = async () => {
    let data = await models.project_group.findAll({
        raw: true
    });
    return data.map(item => {
        objTimeFormater(item);
        return item;
    });
};

/**
 * 新增项目列表
 * @param {object} params 
 */
export const add = async (params) => {
    let { group_name, remark } = params;
    if (!group_name) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少group_name参数');
    }
    let result = await models.project_group.create({
        group_name,
        remark: remark || ''
    });
    if (!result) {
        throw new GlobalError(DB_ERROR_CODE, '添加项目分组失败');
    }
    return result;
};

/**
 * 删除项目分组
 * @param {number} id 项目分组ID
 */
export const del = async (id) => {
    const transaction = await models.sequelize.transaction();
    // 把该项目列表下的所有项目都放到回收站
    try {
        await models.project.update({
            group_id: 0,
            list_id: 0,
            state: 0,
            update_time: dayjs().unix()
        }, {
            where: {
                group_id: id
            },
            transaction
        });
        // 删除项目列表
        await models.project_group.destroy({
            where: {
                id
            },
            transaction
        });
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '删除失败');
    }
};

/**
 * 更新项目分组
 * @param {object} params 
 */
export const update = async (params) => {
    let { id, group_name, remark } = params;
    if (!id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
    }
    if (!group_name) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少group_name参数');
    }
    let projectGroup = await models.project_group.findByPk(id);
    if (!projectGroup) {
        throw new GlobalError(DB_ERROR_CODE, '项目分组不存在');
    }
    await projectGroup.update({
        group_name,
        remark
    });
};