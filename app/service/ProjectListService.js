import models from '../models';

/**
 * 查询项目列表
 * @param {number} groupId 组ID
 */
export const query = async (groupId) => {
    return await models.project_list.findAll({
        where: {
            group_id: groupId
        },
        order: [
            ['pos', 'ASC']
        ]
    });
};