import models from '../models';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE } from '@app/constants/ResponseCode';
import { objTimeFormater } from '@app/util/timeUtil';
import _ from 'lodash';
import dayjs from 'dayjs';

/**
 * 查询项目列表
 * @param {number} groupId 组ID
 */
export const query = async (groupId) => {
    let data = await models.project_list.findAll({
        where: {
            group_id: groupId
        },
        order: [
            ['pos', 'ASC']
        ],
        raw: true
    });
    let allProject = await models.project.findAll({
        where: {
            state: 1
        },
        raw: true
    });
    // 根据列表分组
    let groupProject = _.groupBy(allProject, (item) => item.list_id);
    return data.map(item => {
        // 格式化时间
        objTimeFormater(item);
        if (groupProject[item.id]) {
            item.projectList = groupProject[item.id].map(project => objTimeFormater(project, { keys: ['begin_time'], format: 'YYYY-MM-DD' }));
        }
        return item;
    });
};

/**
 * 新增项目列表
 * @param {object} params 
 */
export const add = async (params) => {
    let { group_id, list_name } = params;
    if (!group_id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少group_id参数');
    }
    if (!list_name) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少list_name参数');
    }
    let result = await models.project_list.create({
        group_id,
        list_name
    });
    if (!result) {
        throw new GlobalError(DB_ERROR_CODE, '添加项目列表失败');
    }
    return result;
};

/**
 * 删除项目列表
 * @param {number} id 项目列表ID
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
                list_id: id
            },
            transaction
        });
        // 删除项目列表
        await models.project_list.destroy({
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
 * 更新项目列表
 * @param {object} params 
 */
export const update = async (params) => {
    let { id, list_name } = params;
    if (!id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
    }
    if (!list_name) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少list_name参数');
    }
    let projectList = await models.project_list.findByPk(id);
    if (!projectList) {
        throw new GlobalError(DB_ERROR_CODE, '项目列表不存在');
    }
    await projectList.update({
        list_name
    });
};