import models from '../models';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE, DATA_NOT_HAVE, RESULT_SUCCESS } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { objTimeFormater } from '@app/util/timeUtil';
import _ from 'lodash';
import { PROJECT_ROLE_PRINCIPAL, PROJECT_ROLE_PARTNER } from '@app/constants/index';


export const query = async (id) => {
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    let memberList = await models.project_member.findAll({
        where: {
            project_id: project.id
        },
        order: [
            ['role', 'DESC']
        ],
        raw: true
    });
    project = project.dataValues;
    project.memberList = memberList;


    return objTimeFormater(project);
};

/**
 * 新增项目
 * @param {object} params 
 */
export const add = async (params) => {
    let { group_id, list_id, project_name, project_logo, begin_time, experience_time, test_time, online_time, priority, tag, pos, remark, user, app_id } = params;
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
    // 处理时间
    if (begin_time) {
        begin_time = dayjs(begin_time).unix();
    } if (experience_time) {
        experience_time = dayjs(experience_time).unix();
    } if (test_time) {
        test_time = dayjs(test_time).unix();
    } if (online_time) {
        online_time = dayjs(online_time).unix();
    }
    const transaction = await models.sequelize.transaction();
    try {
        // 新建项目在最上面其他项目pos加1
        await models.sequelize.query(` update project set pos=pos+1 where list_id=${list_id} `
            , { type: models.UPDATE, transaction });
        let result = await models.project.create({
            group_id,
            list_id,
            project_name,
            project_logo,
            begin_time,
            experience_time, test_time, online_time,
            priority,
            app_id: app_id.trim(),
            tag,
            pos: 1,
            remark: remark || '',
            create_by: user.userName
        }, { transaction });
        if (!result) {
            throw new Error('创建项目失败');
        }
        let memberResult = await models.project_member.create({
            project_id: result.id,
            user_id: user.uid,
            username: user.userName,
            avatar: user.avatar,
            role: 'PRINCIPAL'
        }, { transaction });
        if (!memberResult) {
            throw new Error('添加项目负责人失败');
        }
        await transaction.commit();
        return result;
    } catch (err) {
        console.error(err.message);
        console.log(err);
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
    let { id, group_id, list_id, project_name, project_logo, begin_time, experience_time, test_time, online_time, priority, tag, pos, remark, opr_user_id, app_id } = params;
    let principal = await getPrincipal({ project_id: id, opr_user_id });
    if (!principal) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '此操作只能由负责人进行');
    }
    if (!id) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
    }
    if (begin_time) {
        begin_time = dayjs(begin_time).unix();
    }
    if (experience_time) {
        experience_time = dayjs(experience_time).unix();
    } if (test_time) {
        test_time = dayjs(test_time).unix();
    } if (online_time) {
        online_time = dayjs(online_time).unix();
    }
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    if (app_id) {
        app_id = app_id.trim();
    }
    await project.update({
        group_id,
        list_id,
        project_name,
        project_logo,
        begin_time,
        experience_time, test_time, online_time,
        priority,
        tag,
        pos,
        app_id,
        remark
    });
};

/**
 * 添加项目标签
 * @param {object} params 
 */
// export const addTag = async (params) => {
//     let { id, tag, opr_user_id } = params;
//     let principal = await getPrincipal({ project_id: id, opr_user_id });
//     if (!principal) {
//         throw new GlobalError(INVALID_PARAM_ERROR_CODE, '此操作只能由负责人进行');
//     }
//     let project = await models.project.findByPk(id);
//     if (!project) {
//         throw new GlobalError(DB_ERROR_CODE, '项目不存在');
//     }
//     let tags = [];
//     if (project.tag) {
//         tags = _.split(project.tag, ',');
//     }
//     if (tags.includes(tag)) {
//         throw new GlobalError(INVALID_PARAM_ERROR_CODE, '标签已存在');
//     }
//     tags.push(tag);
//     await project.update({
//         tag: _.join(tags, ',')
//     });
// };

/**
 * 删除标签
 * @param {object} params 
 */
// export const delTag = async (params) => {
//     let { id, tag, opr_user_id } = params;
//     let principal = await getPrincipal({ project_id: id, opr_user_id });
//     if (!principal) {
//         throw new GlobalError(INVALID_PARAM_ERROR_CODE, '此操作只能由负责人进行');
//     }
//     let project = await models.project.findByPk(id);
//     if (!project) {
//         throw new GlobalError(DB_ERROR_CODE, '项目不存在');
//     }
//     let tags = [];
//     if (project.tag) {
//         tags = _.split(project.tag, ',');
//     }
//     if (!tags.includes(tag)) {
//         throw new GlobalError(INVALID_PARAM_ERROR_CODE, '标签不存在');
//     }
//     _.remove(tags, (item) => item === tag);
//     await project.update({
//         tag: _.join(tags, ',')
//     });
// };

/**
 * 修改项目标签
 * @param {object} params 
 */
export const updateTag = async (params) => {
    let { id, tag, opr_user_id } = params;
    let principal = await getPrincipal({ project_id: id, opr_user_id });
    if (!principal) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '此操作只能由负责人进行');
    }
    let project = await models.project.findByPk(id);
    if (!project) {
        throw new GlobalError(DB_ERROR_CODE, '项目不存在');
    }
    await project.update({
        tag
    });
};

/**
 * 更新项目顺序
 * @param {object} params 
 */
export const updatePos = async (params) => {
    let { id, group_id, list_id, project_name, project_logo, begin_time, priority, tag, pos, remark } = params;
    let transaction = await models.sequelize.transaction();
    try {
        if (!id) {
            throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
        }
        let project = await models.project.findByPk(id);
        if (!project) {
            throw new GlobalError(DB_ERROR_CODE, '项目不存在');
        }
        let sql = ` update project set pos=pos+1 where pos >= ? and list_id=? `;
        await models.sequelize.query(sql, { replacements: [pos, list_id], type: models.Sequelize.QueryTypes.UPDATE, transaction });
        await models.project.update({
            list_id: list_id,
            pos: pos
        }, {
            where: {
                id: id
            },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        console.log("更新项目顺序失败", error);
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '更新项目顺序失败');
    }
};
/**
 * 更新项目顺序和所属任务列表
 * @param {object} params 
 */
export const updatePosList = async (params, state) => {
    let { id, list_id, pos, } = params;
    let transaction = await models.sequelize.transaction();
    try {
        if (!id) {
            throw new GlobalError(INVALID_PARAM_ERROR_CODE, '缺少id参数');
        }
        let project = await models.project.findByPk(id);
        if (!project) {
            throw new GlobalError(DB_ERROR_CODE, '项目不存在');
        }
        let sql = ` update project set pos=pos+1 where pos >= ? and list_id=? `;
        await models.sequelize.query(sql, { replacements: [pos, list_id], type: models.Sequelize.QueryTypes.UPDATE, transaction });
        await models.project.update({
            list_id: list_id,
            pos: pos
        }, {
            where: {
                id: id
            },
            transaction
        });
        await models.project_log.create({
            project_id: id,
            operator: state.userName,
            detail: "修改项目分组为：",
            content: list_id,
            column_name: "list",

        }, transaction);
        await transaction.commit();
    } catch (error) {
        console.log("更新项目顺序失败", error);
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '更新项目顺序失败');
    }
};
/**
 * 修改项目负责人（只有原本项目负责人才可以操作）
 * @param {object} newPrincipal
 * @param {number} opr_user_id 操作者用户ID
 */
export const updatePrincipal = async (newPrincipal, opr_user_id) => {
    let oldPrincipal = await getPrincipal({ project_id: newPrincipal.project_id, opr_user_id });
    if (!oldPrincipal) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '此操作只能由负责人进行');
    }
    const transaction = await models.sequelize.transaction();
    try {
        let result = await oldPrincipal.update({
            role: PROJECT_ROLE_PARTNER
        }, { transaction });

        if (!result) {
            throw new Error('数据库修改失败');
        }

        result = await models.project_member.update({
            role: PROJECT_ROLE_PRINCIPAL,
            update_time: dayjs().unix()
        }, {
            where: {
                user_id: newPrincipal.user_id,
                project_id: newPrincipal.project_id
            },
            transaction
        });

        if (!result) {
            throw new Error('数据库修改失败');
        }
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '修改项目负责人失败');
    }
};

/**
 * 获取项目负责人数据
 * @param {object} param 
 */
async function getPrincipal({ project_id, opr_user_id }) {
    let result = await models.project_member.findOne({
        where: {
            project_id,
            user_id: opr_user_id,
            role: PROJECT_ROLE_PRINCIPAL
        }
    });
    return result;
}
/**
 * 查询回收的项目
 */
export const searchRecover = async () => {
    let result = await models.project.findAll({
        where: {
            state: 0
        },
        raw: true
    });
    return result.map(item => {
        return objTimeFormater(item, { keys: ['begin_time'], format: 'YYYY-MM-DD' });

    });
};
returnToProduct;
/**
 * 恢复项目
 */
export const returnToProduct = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 新建项目在最上面其他项目pos加1
        await models.sequelize.query(` update project set pos=pos+1 where list_id=${param.list_id} `
            , { type: models.UPDATE, transaction });
        let result = await models.project.update({
            list_id: param.list_id,
            pos: 1,
            state: 1
        }, {
            where: {
                id: param.id
            },
            raw: true,
            transaction
        });
        await transaction.commit();
        return result;
    } catch (error) {
        console.log("恢复项目错误", error);
        await transaction.rollback();
        throw new GlobalError(DB_ERROR_CODE, '恢复项目错误');
    }

};
/**
 * 彻底删除
 */
export const thoroughdle = async (param) => {
    let result = await models.project.destroy({
        where: {
            id: param.id
        },
        raw: true
    });
    return result;
};
/**
 * 项目跟进表
 * @param {*} param 
 */
export const followUp = async (param) => {
    // param.page = 1;
    // 查询有数据的日期
    let sql = ` SELECT id,DATE_FORMAT(FROM_UNIXTIME(predict_start_time),?) as time FROM task WHERE project_id=${param.project_id} GROUP BY DATE_FORMAT(FROM_UNIXTIME(predict_start_time),'%Y-%m-%d') ORDER BY predict_start_time DESC limit ${(param.page - 1) * 15},15  `;
    let time = await models.sequelize.query(sql, { replacements: ["%Y-%m-%d"], type: models.SELECT });
    if (!time || time.length < 1) {
        return { code: DATA_NOT_HAVE };
    }
    //console.log("1111111111111111111111111", time, (new Date(time[0].time + " 23:59:59").getTime()), (new Date(time[time.length - 1].time + " 00:00:00").getTime()));
    let max = (new Date(time[0].time + " 23:59:59").getTime()) / 1000;
    let min = (new Date(time[time.length - 1].time + " 00:00:00").getTime()) / 1000;
    sql = ` SELECT t1.*,DATE_FORMAT(FROM_UNIXTIME(t1.predict_start_time),'%Y-%m-%d') time,t2.module_name FROM task t1 LEFT JOIN task_module t2 ON t1.module_id=t2.id WHERE t1.project_id=${param.project_id} AND t1.predict_start_time BETWEEN ${min} AND ${max} `;
    let tasks = await models.sequelize.query(sql, { type: models.SELECT });
    let data = dataArrangement(tasks, time);
    return data;
};
/**
 * 数据整理
 * tasks 任务任务数据
 * time  日期数组
 */
async function dataArrangement(tasks, time) {
    try {
        // 临时存放数据对象, key 日期 value 四个数组，数组你们根据任务类型存放任务数据
        let timeData = new Map(),
            // 最后返回的数据
            resultData = [];
        time.forEach(item => {
            timeData[item.time] = [[], [], [], []];
            resultData.push({
                time: item.time,
                data: [],
            });
        });
        // 将任务数据根据日期和任务类型进行分类存放
        tasks.forEach(item => {
            timeData[item.time][item.task_type - 1].push(item);
        });
        // 遍历时按任务类型归类好的数组
        let taskData = [];
        // 任务类型数据量最多的长度
        let maxLength = 0;
        resultData.forEach(item => {
            taskData = timeData[item.time];
            maxLength = 0;
            // 去除最大长度
            for (let i = 0; i < 4; i++) {
                if (taskData[i].length > maxLength) {
                    maxLength = taskData[i].length;
                }
            }

            for (let i = 0; i < maxLength; i++) {
                let object = {};
                // 遍历四个任务类型
                for (let j = 0; j < 4; j++) {
                    if (taskData[j].length >= i) {
                        let jt = taskData[j][i];
                        if (jt) {
                            // 将数据根据类型在key上加上前缀整理好后放入最终结果对象中
                            let keys = Object.keys(jt);
                            keys.forEach(k => {
                                object[(j + 1) + "_" + k] = jt[k];
                            });
                        }

                    }
                }
                item.data.push(object);
            }

        });
        return { code: RESULT_SUCCESS, data: resultData };
    } catch (error) {
        console.log("查询项目赶紧表错误", error);
        return { code: DB_ERROR_CODE, msg: "查询失败" };
    }
}

//时间戳转换方法
function formatDate(date) {
    if (date) {
        date = Number(date);
        date = new Date(date);
        let YY = date.getFullYear() + '-';
        let MM =
            (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) + '-';
        let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hh =
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
            ':';
        let mm =
            (date.getMinutes() < 10
                ? '0' + date.getMinutes()
                : date.getMinutes()) + ':';
        let ss =
            date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return YY + MM + DD + ' ' + hh + mm + ss;
    }
    return '';
}