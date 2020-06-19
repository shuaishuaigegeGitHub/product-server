import models from '@app/models/index';
import dayjs from 'dayjs';

/**
 * 批量插入项目新成员
 * @param {array} memberList 项目成员
 */
export const add = async (memberList) => {
    let now = dayjs().unix();
    memberList.forEach(item => { item.create_time = now });
    await models.project_member.bulkCreate(memberList);
};
