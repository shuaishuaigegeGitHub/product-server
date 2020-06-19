import models from '../models';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { objTimeFormater } from '@app/util/timeUtil';
import _ from 'lodash';

export const query = async (id) => {
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    let memberList = await models.project_member.findAll({
        where: {
            project_id: project.id
        },
        raw: true
    });
    project = project.dataValues;
    project.memberList = memberList;
    if (project.tag) {
        project.tag = _.split(project.tag, ',');
    } else {
        project.tag = [];
    }
    return objTimeFormater(project);
};

/**
 * 新增项目
 * @param {object} params 
 */
export const add = async (params) => {
    let { group_id, list_id, project_name, project_logo, begin_time, priority, tag, pos, remark, user } = params;
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
    const transaction = await models.sequelize.transaction();
    try {
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
            create_by: user.userName
        }, { transaction });
        if (!result) {
            throw new Error('创建项目失败');
        }
        result = await models.project_member.create({
            project_id: result.id,
            user_id: user.uid,
            username: user.userName,
            avatar: user.avatar,
            role: 'PRINCIPAL'
        }, { transaction });
        if (!result) {
            throw new Error('添加项目负责人失败');
        }
        await transaction.commit();
        return result;
    } catch (err) {
        console.error(err.message);
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '创建项目失败');
    }
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
    if (begin_time) {
        begin_time = dayjs(begin_time).unix();
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

/**
 * 添加项目标签
 * @param {object} params 
 */
export const addTag = async (params) => {
    let { id, tag } = params;
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    let tags = [];
    if (project.tag) {
        tags = _.split(project.tag, ',');
    }
    if (tags.includes(tag)) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '标签已存在');
    }
    tags.push(tag);
    await project.update({
        tag: _.join(tags, ',')
    });
};

/**
 * 删除标签
 * @param {object} params 
 */
export const delTag = async (params) => {
    let { id, tag } = params;
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    let tags = [];
    if (project.tag) {
        tags = _.split(project.tag, ',');
    }
    if (!tags.includes(tag)) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '标签不存在');
    }
    _.remove(tags, (item) => item === tag);
    await project.update({
        tag: _.join(tags, ',')
    });
};