import models from '@app/models/index';
import { calendarTimeFormater } from '@app/util/timeUtil';
import { where } from 'sequelize';

/**
 * 查询项目动态
 * @param {number} id 项目ID
 * @param {object} params 查询参数
 */
export const query = async (id, params) => {
    let { last_log_id } = params;
    let where = {
        project_id: id
    };
    if (last_log_id) {
        // 查询 id > last_log_id 的数据
        where.id = {
            [models.Sequelize.Op.gt]: last_log_id
        };
    }
    let allLog = await models.project_log.findAll({
        where: where,
        order: [
            ['create_time', 'DESC']
        ],
        raw: true
    });
    allLog.forEach(item => {
        item.create_time = calendarTimeFormater(item.create_time);
    });
    return allLog;
};
