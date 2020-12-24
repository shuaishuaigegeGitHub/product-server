// 项目管理
import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { delFile } from '../util/localOperationFile';
import { sqlAppent } from '../util/sqlAppent';
import { userMap } from './UserService';
/**
 * 初始化
 */
export const init = async (param) => {
    // 效验是否已经初始化过
    const checkProudct = await models.product.findAll({ where: { id: param.id, initialization: 2 } });
    if (checkProudct && checkProudct.length) {
        return { code: RESULT_ERROR, msg: '初始化失败，已初始化' };
    }
    const [functs, transaction] = [[], await models.sequelize.transaction()];
    try {
        // 更新主表信息
        functs.push(models.product.update({
            initialization: 2,
            APPID: param.APPID,
            APPKEY: param.APPKEY,
            webhook: param.webhook,
            keyword: param.keyword
        }, {
            where: {
                id: param.id
            },
            transaction
        }));
        // 往分组表里添加四个分组
        const bulk = [
            {
                product_id: param.id,
                group_name: '程序组',
                type: 1
            },
            {
                product_id: param.id,
                group_name: '美术组',
                type: 2
            },
            {
                product_id: param.id,
                group_name: '策划组',
                type: 3
            },
            {
                product_id: param.id,
                group_name: '运营组',
                type: 4
            }
        ];
        functs.push(models.task_group.bulkCreate(bulk, { transaction }));
        // 调用游戏自动创建数据库接口（暂无）
        await Promise.all(functs);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '初始化成功' };
    } catch (error) {
        console.log('初始化错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '初始化错误' };
    }
};

/**
 * 保存基础配置
 */
export const basic_Configuration = async (param) => {
    console.log('===========保存基础配置================', param);
    const transaction = await models.sequelize.transaction();
    try {
        const urls = [];
        // 删除文件
        if (param.delFiles && param.delFiles.length) {
            param.delFiles.forEach(item => {
                delFile(item.url);
                urls.push(item.url);
            });
            await models.file.destroy({
                where: {
                    url: { $in: urls }
                },
                transaction
            });
        }
        // 增加文件文件
        if (param.addFiles && param.addFiles.url) {

            await models.file.create({
                product_id: param.id,
                type: 1,
                name: param.addFiles.name,
                url: param.addFiles.url,
                size: param.addFiles.size,
                create_time: dayjs().unix()
            }, { transaction });
            // const fiels = [];
            // param.addFiles.forEach(item => {
            //     fiels.push({
            //         product_id: param.id,
            //         type: 1,
            //         name: item.name,
            //         url: item.url,
            //         size: item.size,
            //         create_time: dayjs().unix()
            //     });
            // });
            // await models.file.bulkCreate(fiels, transaction);
        }
        // // 增加文件项目icon
        // if (param.addFiles) {
        //     let file = param.addFiles;
        //     await models.file.create({
        //         product_id: param.id,
        //         type: 1,
        //         name: file.name,
        //         url: file.url,
        //         size: file.size,
        //         create_time: dayjs().unix()
        //     }, transaction);
        // }
        await models.product.update({
            product_name: param.product_name,
            APPID: param.APPID,
            APPKEY: param.APPKEY,
            webhook: param.webhook,
            keyword: param.keyword
        }, {
            where: {
                id: param.id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '保存成功' };
    } catch (error) {
        console.log('保存基础配置失败', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '保存失败' };
    }
};
/**
 * 查询基础配置
 * @param {*} param
 */
export const findBaseConfig = async (param) => {
    if (!param.id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    const result = await models.product.findOne({
        attributes: ['product_name', 'APPID', 'APPKEY', 'webhook', 'keyword', 'initialization'],
        where: {
            id: param.id
        },
        raw: true
    });
    const file = await models.file.findOne({
        where: {
            product_id: param.id,
            type: 1
        },
    });
    result.file = file;
    return { code: RESULT_SUCCESS, data: result, msg: '查询成功' };
};
/**
 * 保存人员配置
 */
export const personSave = async (param) => {
    const transaction = await models.sequelize.transaction();
    try {
        await models.product.update({
            main_course: param.main_course,
            master_beauty: param.master_beauty
        }, {
            where: {
                id: param.id
            },
            transaction
        });
        // 清空人员配置
        await models.person.destroy({
            where: {
                product_id: param.id
            },
            transaction
        });
        const persons = [];
        // 美术
        if (param.painting && param.painting.length) {
            param.painting.forEach(item => {
                persons.push({
                    user_id: item,
                    user_name: '',
                    type: 1,
                    product_id: param.id
                });
            });
        }
        // 程序
        if (param.program && param.program.length) {
            param.program.forEach(item => {
                persons.push({
                    user_id: item,
                    user_name: '',
                    type: 2,
                    product_id: param.id
                });
            });
        }
        // 策划
        if (param.plan && param.plan.length) {
            param.plan.forEach(item => {
                persons.push({
                    user_id: item,
                    user_name: '',
                    type: 3,
                    product_id: param.id
                });
            });
        }
        // 运营
        if (param.operate && param.operate.length) {
            param.operate.forEach(item => {
                persons.push({
                    user_id: item,
                    user_name: '',
                    type: 4,
                    product_id: param.id
                });
            });
        }
        await models.person.bulkCreate(persons, { transaction });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '保存人员配置成功' };
    } catch (error) {
        console.log('保存人员配置错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '保存人员配置错误' };
    }
};
/**
 * 查询产品人员配置
 * @param {*} param
 */
export const findProductPeson = async (param) => {
    const product = await models.product.findOne({
        attributes: ['main_course', 'master_beauty', 'plan_manage_id', 'project_leader'],
        where: {
            id: param.id
        }
    });
    const result = { main_course: product.main_course, master_beauty: product.master_beauty, program: [], painting: [], plan: [], operate: [] };
    const person = await models.person.findAll({
        where: {
            product_id: param.id
        }
    });
    if (person.length) {
        person.forEach(item => {
            switch (item.type) {
                case 1:
                    result.painting.push(item.user_id);
                    break;
                case 2:
                    result.program.push(item.user_id);
                    break;
                case 3:
                    result.plan.push(item.user_id);
                    break;
                case 4:
                    result.operate.push(item.user_id);
                    break;
            }
        });
    }
    return { code: RESULT_SUCCESS, data: result, msg: '查询产品人员配置成功' };
};
/**
 * 生成里程碑
 */
export const fixedFile = async (param) => {
    try {
        // 查询分组
        const groups = await models.task_group.findAll({
            where: {
                product_id: param.id,
                type: { $in: [1, 2] }
            },
            raw: true,
        });
        if (!groups || !groups.length) {
            return { code: RESULT_ERROR, msg: '项目未初始化请先初始化' };
        }
        // 程序分组id，美术分组id
        let [cx, ms] = [0, 0];
        groups.forEach(item => {
            if (item.type == 1) {
                cx = item.id;
            } else if (item.type == 2) {
                ms = item.id;
            }
        });

        // 查询所有任务
        const tasks = await models.task.findAll({
            where: {
                product_id: param.id,
                group_id: { $in: [cx, ms] },
                status: { $in: [1, 2] }
            },
            raw: true,
            order: [
                ['start_time', 'asc']
            ]
        });
        if (!tasks || !tasks.length) {
            return { code: RESULT_ERROR, msg: '生成里程碑失败请先创建任务' };
        }
        // 程序介入日期,程序完成日期,美术介入日期,美术完成日期
        let [program_intervention_time, program_end_time, art_intervention_time, art_end_time] = [0, 0, 0, 0];
        tasks.forEach(item => {
            if (item.group_id == cx) {
                if (!program_intervention_time) {
                    program_intervention_time = item.start_time;
                }
                if (item.start_time) {
                    program_end_time = item.start_time;
                }
            } else if (item.group_id == ms) {
                if (!art_intervention_time) {
                    art_intervention_time = item.start_time;
                }
                if (item.start_time) {
                    art_end_time = item.start_time;
                }
            }
        });
        // 更新数据
        await models.sequelize.query(
            '  UPDATE product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id set t1.fixed_file=2,t2.program_intervention_time=?,t2.program_end_time=?,t2.art_intervention_time=?,t2.art_end_time=? WHERE t1.id=? ',
            { replacements: [program_intervention_time, program_end_time, art_intervention_time, art_end_time, param.id], type: models.UPDATE }
        );

        return { code: RESULT_SUCCESS, msg: '生成里程碑成功' };
    } catch (error) {
        console.log('生成里程碑错误', error);

        return { code: RESULT_ERROR, msg: '生成里程碑错误' };
    }
};

/**
 * 保存里程碑
 */
export const updateMilepost = async (param) => {
    try {
        // 保存里程碑数据
        await models.product_schedule.update({
            selection_time: param.selection_time ? parseInt(param.selection_time / 1000) : undefined,
            project_approval_time: param.project_approval_time ? parseInt(param.project_approval_time / 1000) : undefined,
            file_complete_time: param.file_complete_time ? parseInt(param.file_complete_time / 1000) : undefined,
            strat_up_time: param.strat_up_time ? parseInt(param.strat_up_time / 1000) : undefined,
            program_intervention_time: param.program_intervention_time ? parseInt(param.program_intervention_time / 1000) : undefined,
            program_end_time: param.program_end_time ? parseInt(param.program_end_time / 1000) : undefined,
            art_intervention_time: param.paramart_intervention_time ? parseInt(param.paramart_intervention_time / 1000) : undefined,
            art_end_time: param.art_end_time ? parseInt(param.art_end_time / 1000) : undefined,
            core_functions_time: param.core_functions_time ? parseInt(param.core_functions_time / 1000) : undefined,
            demo_time: param.demo_time ? parseInt(param.demo_time / 1000) : undefined,
            experience_time: param.experience_time ? parseInt(param.experience_time / 1000) : undefined,
            transfer_operation_time: param.transfer_operation_time ? parseInt(param.transfer_operation_time / 1000) : undefined,
            extension_time: param.extension_time ? parseInt(param.extension_time / 1000) : undefined,
        }, {
            where: {
                product_id: param.id
            }

        });

        return { code: RESULT_SUCCESS, msg: '保存里程碑成功' };
    } catch (error) {
        console.log('保存里程碑错误', error);
        return { code: RESULT_ERROR, msg: '保存里程碑错误' };
    }
};
/**
 * 查询里程碑
 * @param {*} param
 */
export const findeMilepost = async (param) => {
    const result = await models.product_schedule.findOne({
        attributes: ['selection_time', 'project_approval_time', 'file_complete_time', 'strat_up_time', 'program_intervention_time', 'program_end_time', 'art_intervention_time', 'art_end_time', 'core_functions_time', 'demo_time', 'experience_time', 'transfer_operation_time', 'extension_time'],
        where: {
            product_id: param.id
        },
        raw: true
    });
    const product = await models.product.findOne({
        attributes: ['fixed_file'],
        where: {
            id: param.id
        },
        raw: true
    });
    result.selection_time = result.selection_time ? parseInt(result.selection_time * 1000) : 1;
    result.project_approval_time = result.project_approval_time ? parseInt(result.project_approval_time * 1000) : undefined;
    result.file_complete_time = result.file_complete_time ? parseInt(result.file_complete_time * 1000) : undefined;
    result.strat_up_time = result.strat_up_time ? parseInt(result.strat_up_time * 1000) : undefined;
    result.program_intervention_time = result.program_intervention_time ? parseInt(result.program_intervention_time * 1000) : undefined;
    result.program_end_time = result.program_end_time ? parseInt(result.program_end_time * 1000) : undefined;
    result.art_intervention_time = result.art_intervention_time ? parseInt(result.art_intervention_time * 1000) : undefined;
    result.art_end_time = result.art_end_time ? parseInt(result.art_end_time * 1000) : undefined;
    result.core_functions_time = result.core_functions_time ? parseInt(result.core_functions_time * 1000) : undefined;
    result.demo_time = result.demo_time ? parseInt(result.demo_time * 1000) : undefined;
    result.experience_time = result.experience_time ? parseInt(result.experience_time * 1000) : undefined;
    result.transfer_operation_time = result.transfer_operation_time ? parseInt(result.transfer_operation_time * 1000) : undefined;
    result.extension_time = result.extension_time ? parseInt(result.extension_time * 1000) : undefined;
    result.fixed_file = product.fixed_file;
    // 响应天数
    result.responseDays = 0;
    // 项目周期
    result.cycle = 0;
    if (result.selection_time && result.extension_time) {
        result.responseDays = parseInt((result.extension_time - result.selection_time) / 1000 / 60 / 60 / 24);
    }
    if (result.strat_up_time && result.transfer_operation_time) {
        result.cycle = parseInt((result.transfer_operation_time - result.strat_up_time) / 1000 / 60 / 60 / 24);
    }
    return { code: RESULT_SUCCESS, msg: '查询里程碑成功', data: result };
};
/**
 * 文件管理文件查询
 */
export const findManageFileAll = async (param) => {
    const files = await models.file.findAll({
        where: {
            product_id: param.id,
            type: { $gt: 2 }
        },
        raw: true
    });
    const result = [];
    const fileType = {};
    if (files && files.length) {
        files.forEach(item => {
            if (fileType[item.type]) {
                fileType[item.type].push(item);
            } else {
                fileType[item.type] = [item];
            }
        });
    }
    const types = Object.keys(fileType);
    if (types && types.length) {
        let folderName = '';
        types.forEach(item => {
            switch (`${item}`) {
                case '3':
                    folderName = '会议记录';
                    break;
                case '4':
                    folderName = '游戏截图';
                    break;
                case '5':
                    folderName = '游戏玩法视频';
                    break;
                case '6':
                    folderName = '策划文案';
                    break;
                case '7':
                    folderName = '启动会，会议议记录';
                    break;
                case '8':
                    folderName = '任务附件';
                    break;
                case '9':
                    folderName = 'demo版会议记录';
                    break;
            }
            result.push({ folderName, files: fileType[item] });
        });
    }
    return { code: RESULT_SUCCESS, data: result, msg: '获取文件成功' };
};

/**
 * 添加分组
 */
export const addGroup = async (param) => {
    await models.task_group.create({
        product_id: param.product_id,
        group_name: param.group_name
    });
    return { code: RESULT_SUCCESS, msg: '添加分组成功' };
};
/**
 * 修改分组
 */
export const updateGroup = async (param) => {
    if (!param.id) {
        return { code: RESULT_ERROR, msg: '修改分组失败，参数错误，缺少分组类型' };
    }
    const group = await models.task_group.findOne({ where: { id: param.id } });
    if (group.type > 0) {
        return { code: RESULT_ERROR, msg: '修改分组失败，系统默认分组禁止修改' };
    }
    await models.task_group.update({
        group_name: param.group_name
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '修改分组成功' };
};
/**
 * 删除分组
 */
export const delGroup = async (param) => {
    if (!param.id) {
        return { code: RESULT_ERROR, msg: '删除分组失败，参数错误' };
    }
    const group = await models.task_group.findOne({ where: { id: param.id } });
    if (group.type > 0) {
        return { code: RESULT_ERROR, msg: '删除分组失败，系统默认分组禁止删除' };
    }
    // 判断分组下是否有任务
    const task = await models.task.count({
        where: {
            group_id: param.id,
            status: { lt: 3 }
        }
    });
    if (task > 0) {
        return { code: RESULT_ERROR, msg: '删除分组失败，分组下存在任务禁止删除' };
    }
    await models.task_group.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '删除分组成功' };
};
/**
 * 查询分组
 */
export const findGroup = async (param) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: '查询分组失败，参数错误' };
    }
    const result = await models.task_group.findAll({
        where: {
            product_id: param.product_id
        }
    });
    return { code: RESULT_SUCCESS, data: result, msg: '查询分组成功' };
};
/**
 * 添加任务
 */
export const addTask = async (param, token) => {
    param.start_time = param.start_time ? parseInt(param.start_time / 1000) : 0;
    param.end_time = param.end_time ? parseInt(param.end_time / 1000) : 0;
    // 如果添加的任务包含执行时间和执行人则效验任务时间是否冲突
    if (param.start_time && param.end_time) {
        // 效验时间安排是否合理
        // 最大时间 单位秒
        const maxTime = process.env.PRODUCT_TASK_MAX_TIME;
        // 最小时间 单位秒
        const minTime = process.env.PRODUCT_TASK_MIN_TIME;

        const useTime = param.end_time - param.start_time;
        console.log('(=====,)', maxTime, minTime, useTime);
        if (useTime < minTime) {
            return { code: RESULT_ERROR, msg: '更新任务失败任务时间过短' };
        }
        if (useTime > maxTime) {
            return { code: RESULT_ERROR, msg: '更新任务失败任务时间过长' };
        }
        const sql = ` SELECT count(1) as count FROM task t1  WHERE t1.product_id=${param.product_id} 	AND t1.executors=${token.uid} and t1.status=1 and ( ((t1.start_time<=${param.start_time} AND t1.end_time> ${param.start_time} ) OR (t1.start_time< ${param.end_time} AND t1.end_time>=${param.end_time} )) OR (t1.start_time> ${param.start_time}  AND t1.end_time< ${param.end_time} ) )`;
        const result = await models.sequelize.query(sql, { type: models.SELECT });
        if (result[0].count) {
            return { code: RESULT_ERROR, msg: '添加任务失败任务时间冲突' };
        }
    }
    const transaction = await models.sequelize.transaction();
    try {
        const product = await models.product.findOne({
            attributes: ['fixed_file', 'status'],
            where: {
                id: param.product_id
            },
            raw: true
        });
        // demo开始追加的任务做标记
        let additional = 1;
        if (product.status > 3) {
            additional = 2;
        }
        // let fixed_file = product.fixed_file;
        //     // 是否已生成里程碑，生成里程碑后增加需要记录
        //     if (fixed_file == 2) {
        //         let record = {
        //             product_id: param.product_id,
        //             type: 2,
        //             message: "增加任务。任务标题：" + param.title + "，任务描述：" + param.describe,
        //             user_id: token.uid,
        //             reason: param.reason,
        //             create_time: dayjs().unix()
        //         };
        //     }
        //     await models.alert_record.create(record, { transaction });
        // 保存任务
        let taskResult = await models.task.create({
            product_id: param.product_id,
            group_id: param.group_id,
            label: param.label,
            title: param.title,
            describe: param.describe,
            start_time: param.start_time,
            end_time: param.end_time,
            additional,
            executors: token.uid,
            create_user: token.uid
        }, { transaction });
        taskResult = taskResult.get();
        // 有设置协助人员添加人员
        if (param.person && param.person) {
            const person = [];
            param.person.forEach(item => {
                person.push({
                    task_id: taskResult.id,
                    user_id: item
                });
            });
            await models.task_person.bulkCreate(person, { transaction });
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '添加任务成功' };
    } catch (error) {
        console.log('添加任务错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '添加任务错误' };
    }
};
/**
 *更新任务
 */
export const updateTask = async (param, token, hearToken) => {
    console.log('========更新任务===========', param);
    param.start_time = param.start_time ? parseInt(param.start_time / 1000) : 0;
    param.end_time = param.end_time ? parseInt(param.end_time / 1000) : 0;
    if (param.start_time && param.end_time) {
        // 效验时间安排是否合理
        // 最大时间 单位秒
        const maxTime = process.env.PRODUCT_TASK_MAX_TIME;
        // 最小时间 单位秒
        const minTime = process.env.PRODUCT_TASK_MIN_TIME;
        const useTime = param.end_time - param.start_time;
        if (useTime < minTime) {
            return { code: RESULT_ERROR, msg: '更新任务失败任务时间过短' };
        }
        if (useTime > maxTime) {
            return { code: RESULT_ERROR, msg: '更新任务失败任务时间过长' };
        }
    }

    const transaction = await models.sequelize.transaction();
    const functs = [];
    try {
        const product = await models.product.findOne({
            attributes: ['fixed_file', 'status'],
            where: {
                id: param.product_id
            },
            raw: true
        });
        const fixed_file = product.fixed_file;
        // 是否已生成里程碑，生成里程碑后修改需要记录
        if (fixed_file == 2) {
            if (!param.reason) {
                await transaction.rollback();
                return { code: RESULT_ERROR, msg: '参数错误，请填写修改理由' };
            }
            const checkResult = await checkTaskAlert(param, hearToken);
            if (checkResult.str) {
                // 如果时间或者执行人有修改
                if (checkResult.timeAlert) {
                    // 后续任务顺延
                    await taskPostponement(param, transaction, token);
                }

                // 添加修改记录
                functs.push(models.alert_record.create({
                    product_id: param.product_id,
                    task_id: param.id,
                    type: 2,
                    message: checkResult.str,
                    user_id: token.uid,
                    reason: param.reason,
                    create_time: dayjs().unix()
                }, { transaction }));
            } else {
                await transaction.rollback();
                return { code: RESULT_SUCCESS, msg: '更新任务成功' };
            }
        } else {
            // 没有
            // 如果添加的任务包含执行时间和执行人则效验任务时间是否冲突
            if (param.start_time && param.end_time) {
                const sql = ` SELECT count(1) as count FROM task t1  WHERE id !=${param.id} AND t1.executors=${param.executors} and t1.product_id=${param.product_id} and t1.status=1 and  ( ((t1.start_time<=${param.start_time} AND t1.end_time> ${param.start_time} ) OR (t1.start_time< ${param.end_time} AND t1.end_time>=${param.end_time} )) OR (t1.start_time> ${param.start_time}  AND t1.end_time< ${param.end_time} ) )`;
                const result = await models.sequelize.query(sql, { type: models.SELECT });
                if (result[0].count) {
                    await transaction.rollback();
                    return { code: RESULT_ERROR, msg: '更新任务失败任务时间冲突' };
                }
            }
        }
        // 保存任务
        functs.push(models.task.update({
            product_id: param.product_id,
            group_id: param.group_id,
            priority: param.priority,
            label: param.label,
            title: param.title,
            describe: param.describe,
            executors: param.executors,
            acceptor: param.acceptor,
            start_time: param.start_time,
            end_time: param.end_time,
        }, {
            where: {
                id: param.id
            },
            transaction
        }));
        // 有设置协助人员
        if (param.person && param.person.length) {
            const person = [];
            param.person.forEach(item => {
                person.push({
                    task_id: param.id,
                    user_id: item
                });
            });
            // 删除旧数据
            functs.push(models.task_person.destroy({
                where: {
                    task_id: param.id
                },
                transaction
            }));
            // 添加数据
            functs.push(models.task_person.bulkCreate(person, { transaction }));
        }
        await Promise.all(functs);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '更新任务成功' };
    } catch (error) {
        console.log('更新任务错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '更新任务错误' };
    }
};
/**
 * 作废任务
 * @param {*} param
 */
export const cancelTask = async (param, token) => {
    console.log('========作废任务===========', param);
    const transaction = await models.sequelize.transaction();
    const time = dayjs().unix();
    try {
        const product = await models.product.findOne({
            attributes: ['fixed_file'],
            where: {
                id: param.product_id
            },
            raw: true
        });
        const fixed_file = product.fixed_file;
        // 是否已生成里程碑，生成里程碑后修改需要记录
        if (fixed_file == 2) {
            if (!param.reason) {
                transaction.rollback();
                return { code: RESULT_ERROR, msg: '参数错误，请填写作废理由' };
            }
            // 更新修改记录
            await models.alert_record.create({
                product_id: param.product_id,
                task_id: param.id,
                type: 2,
                message: `作废任务：任务标题：${param.title}，任务描述：${param.describe},id:${param.id}`,
                user_id: token.uid,
                reason: param.reason,
                create_time: time
            }, { transaction });
        }
        await models.task.update({
            status: 3,
            cancel_time: time
        }, {
            where: {
                id: param.id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '作废任务成功' };
    } catch (error) {
        console.log('作废任务错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '作废任务错误' };
    }
};
/**
 * 任务添加附件
 */
export const taskAddFile = async (param) => {
    await models.file.create({
        product_id: param.product_id,
        task_id: param.task_id,
        type: 8,
        name: param.name,
        url: param.url,
        size: param.size,
        create_time: dayjs().unix()
    });
    return { code: RESULT_SUCCESS, msg: '任务添加附件成功' };
};
/**
 * 任务删除附件
 */
export const taskDelFile = async (param) => {
    if (!param.url) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    const transaction = await models.sequelize.transaction();
    try {
        await models.file.destroy({
            where: {
                url: param.url
            },
            transaction
        });
        delFile(param.url);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '任务删除附件成功' };
    } catch (error) {
        console.log('任务删除附件错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '任务删除附件错误' };
    }
};
/**
 * 添加子任务
 */
export const addSubset = async (param) => {
    await models.task_subset.create({
        task_id: param.task_id,
        message: param.message
    });
    return { code: RESULT_SUCCESS, msg: '添加子任务成功' };
};

/**
 * 查询子任务
 * @param {*} param 
 */
export const findSubset = async (param) => {
    if (!param.task_id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    let subset = await models.task_subset.findAll({
        where: {
            task_id: param.task_id,
        }
    });
    let result = { incomplete: [], complete: [] };
    subset.forEach(item => {
        if (item.status == 1) {
            result.incomplete.push(item);
        } else {
            result.complete.push(item);
        }
    });
    return { code: RESULT_SUCCESS, data: result };
};
/**
 * 完成子任务
 */
export const updateSubset = async (param) => {
    await models.task_subset.update({
        status: 2
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '完成子任务成功' };
};
/**
 * 添加评论
 */
export const addComment = async (param, token) => {
    const task = await models.task.findOne({
        where: {
            id: param.id
        }
    });
    let comment = '',
        time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let commentArr = [];
    if (task.comment && task.comment.length) {
        commentArr = JSON.parse(task.comment);
        commentArr.push({
            time,
            message: param.message,
            userid: token.uid,
            username: token.userName,
            avatar: token.avatar
        });
        comment = JSON.stringify(commentArr);
    } else {
        commentArr = [{
            time,
            message: param.message,
            userid: token.uid,
            username: token.userName,
            avatar: token.avatar
        }];
        comment = JSON.stringify(commentArr);
    }
    await models.task.update({
        comment
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '添加评论成功', data: commentArr };
};
/**
 * 查询产品所有任务并按照分组进行划分
 */
export const findProductTaskAll = async (param, hearToken) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: '查询产品任务失败，参数错误' };
    }
    const sql = ` SELECT t1.*,t1.start_time*1000 as start_time,t1.end_time*1000 as end_time FROM task t1 where t1.product_id=${param.product_id} and t1.status in (1,2)  GROUP BY t1.id order by  t1.start_time `;
    const task = await models.sequelize.query(sql, { type: models.SELECT });
    const users = await userMap(hearToken);
    const group = {};
    task.forEach(item => {
        if (users[item.executors]) {
            item.executors_name = users[item.executors].username;
            item.executors_avatar = users[item.executors].avatar;
        }
        if (group[item.group_id]) {
            if (item.status == 1) {
                // 未完成
                group[item.group_id].incomplete.push(item);
            } else if (item.status == 2) {
                // 已完成
                group[item.group_id].complete.push(item);
            }
        } else {
            if (item.status == 1) {
                // 未完成
                group[item.group_id] = { incomplete: [item], complete: [] };
            } else if (item.status == 2) {
                // 已完成
                group[item.group_id] = { incomplete: [], complete: [item] };
            }
        }
    });
    return { code: RESULT_SUCCESS, msg: '查询产品任务成功', data: group };
};
/**
 * 按照分组查询任务
 */
export const findGroupTask = async (param, hearToken) => {
    console.log('======== 按照分组查询任务===========', param);
    let sql = ' SELECT t1.*,t1.start_time*1000 as start_time,t1.end_time*1000 as end_time  FROM task t1  ';
    if (param.time && param.time.length > 1) {
        param.time[0] = param.time[0] / 1000;
        param.time[1] = param.time[1] / 1000;
    }
    let object = {
        'product_id$=': param.product_id,
        'group_id$=': param.group_id,
        'executors$=': param.executors,
        'start_time$b': param.time,
        ' status$i': [1, 2]
    },
        sqlMap = {
            product_id: 't1.product_id',
            group_id: 't1.group_id',
            executors: 't1.executors',
            start_time: 't1.start_time',
            status: 't1.status'
        };
    const sqlResult = sqlAppent(object, sqlMap, sql);
    sql += `${sqlResult.sql} GROUP BY t1.id `;
    // 排序
    if (param.sort) {
        // 时间排序
        if (param.sort == 1) {
            sql += ' order by t1.start_time ';
        } else if (param.sort == 2) {
            // 优先级排序
            sql += ' order by t1.priority ';
        }
    }
    const tasks = await models.sequelize.query(sql, { replacements: sqlResult.param, type: models.SELECT });
    const users = await userMap(hearToken);
    const reslut = { incomplete: [], complete: [] };
    tasks.forEach(item => {
        item.comment = item.comment ? JSON.parse(item.comment) : [];
        if (users[item.executors]) {
            item.executors_name = users[item.executors].username;
            item.executors_avatar = users[item.executors].avatar;
        }
        if (item.status == 1) {
            // 未完成
            reslut.incomplete.push(item);
        } else if (item.status == 2) {
            // 已完成
            reslut.complete.push(item);
        }
    });
    return { code: RESULT_SUCCESS, msg: '任务成功', data: reslut };
};

/**
 * 查询任务详情
 */
export const findTaskDetail = async (param, hearToken) => {
    console.log('===========查询任务详情==============', param);
    const data = await Promise.all([
        // 插
        // 基础数据
        models.sequelize.query(`SELECT t2.fixed_file,t1.* FROM task t1 LEFT JOIN product t2  ON t1.product_id=t2.id WHERE t1.id=${param.id}`, { type: models.SELECT }),
        // 子任务
        models.task_subset.findAll({ where: { task_id: param.id }, raw: true }),
        // 任务协助人
        models.task_person.findAll({ where: { task_id: param.id }, raw: true }),
        userMap(hearToken),
        // 任务文件
        models.file.findAll({ where: { task_id: param.id }, raw: true })
    ]);
    let [result, subset, person, users, file] = [data[0], data[1], data[2], data[3], data[4]];

    result = result[0];
    result.start_time = result.start_time ? result.start_time : undefined;
    result.end_time = result.end_time ? result.end_time : undefined;
    // 评论做处理
    if (result.comment && result.comment.length) {
        result.comment = JSON.parse(result.comment);
        result.comment.forEach(item => {
            const user = users[item.user_id];
            if (user) {
                item.user_name = user.username,
                    item.avatar = user.avatar;
            }
        });
    }
    if (users[result.acceptor]) {
        result.acceptor_name = users[result.acceptor].username;
        result.acceptor_avatar = users[result.acceptor].avatar;
    }
    if (users[result.executors]) {
        result.executors_name = users[result.executors].username;
        result.executors_avatar = users[result.executors].avatar;
    }
    result.start_time *= 1000;
    result.end_time *= 1000;
    if (person.length) {
        person.forEach(item => {
            const user = users[item.user_id];
            if (user) {
                item.user_name = user.username,
                    item.avatar = user.avatar;
            }
        });
    }
    result.person = person;
    // 子任务分成未完成，已完成
    result.childrenTask = { incomplete: [], complete: [] };
    subset.forEach(item => {
        if (item.status == 1) {
            result.childrenTask.incomplete.push(item);
        } else if (item.status == 2) {
            result.childrenTask.complete.push(item);
        }
    });
    result.files = file;
    return { code: RESULT_SUCCESS, data: result, msg: '查询任务详情成功' };
};
/**
 * 完成任务
 */
export const completeTask = async (param, token) => {
    console.log('======== 完成任务===========', param);
    // 效验一下子任务是否完场，是否是执行人
    const [subset, person] = await Promise.all([
        models.task_subset.findAll({ where: { task_id: param.id, status: 1 } }),
        models.sequelize.query(` SELECT t1.id,t1.acceptor,t1.start_time,t1.end_time FROM task t1 LEFT JOIN task_person t2 ON t1.id=t2.task_id WHERE t1.id=${param.id} AND ( t1.executors=${token.uid} OR t2.user_id=${token.uid} ) `, { type: models.SELECT })
    ]);
    if (subset && subset.length) {
        return { code: RESULT_ERROR, msg: '完成任务失败，还有子任务未完成' };
    }
    if (!person || !person.length) {
        return { code: RESULT_ERROR, msg: '完成任务失败，当前用户非本任务执行人或协助人' };
    }
    let task = person[0];
    if (!task.acceptor || !task.start_time || !task.end_time) {
        return { code: RESULT_ERROR, msg: '完成任务失败，请先完善任务资料' };
    }
    await models.task.update({
        status: 2,
        real_end_time: dayjs().unix(),
        complete: token.uid
    }, {
        where: {
            id: param.id,

        }
    });
    return { code: RESULT_SUCCESS, msg: '完成任务成功' };
};

/**
 * 查询研发中到上线推广中的产品名称和id
 */
export const idAndName = async (param) => {
    const result = await models.product.findAll({
        attributes: ['id', 'product_name'],
        where: {
            status: { $between: [2, 8] },
            del: 1
        }
    });
    return { code: RESULT_SUCCESS, data: result, msg: '查询成功' };
};
/**
 * 效验任务修改内容
 */
async function checkTaskAlert(param, hearToken) {
    // 获取旧数据
    const proResult = await Promise.all([
        models.task.findOne({ where: { id: param.id } }),
        models.task_person.findAll({ where: { task_id: param.id } }),
        userMap(hearToken)
    ]);
    // 旧任务数据
    const oldData = proResult[0];
    // 旧执行人数据
    const person = proResult[1];
    // 用户管理系统，用户数据
    const users = proResult[2];
    const result = { str: '', timeAlert: false };
    // 对比标题
    if (oldData.title != param.title) {
        result.str += ` 旧标题 ${oldData.title},新标题 ${param.title}。`;
    }
    // 对比标签
    if (oldData.label != param.label) {
        result.str += ` 旧标签 ${oldData.label},新标签 ${param.label}。`;
    }

    if (oldData.priority != param.priority) {
        result.str += ` 旧优先级 ${oldData.priority},新优先级 ${param.priority}。`;
    }
    if (oldData.describe != param.describe) {
        result.str += ` 旧任务描述 ${oldData.describe},新任务描述 ${param.describe}。`;
    }
    if (oldData.title != param.title) {
        result.str += ` 旧标题 ${oldData.title},新标题 ${param.title}。`;
    }
    if (oldData.start_time != param.start_time) {
        let [oldTime, newTime] = ['', ''];
        if (oldData.start_time) {
            oldTime = dayjs(oldData.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
        if (param.start_time) {
            newTime = dayjs(param.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
        result.timeAlert = true;
        result.str += ` 旧任务开始时间 ${oldTime},新任务开始时间 ${newTime}。`;
    }
    if (oldData.end_time != param.end_time) {
        let [oldTime, newTime] = ['', ''];
        if (oldData.start_time) {
            oldTime = dayjs(oldData.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
        if (param.start_time) {
            newTime = dayjs(param.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
        result.timeAlert = true;
        result.str += ` 旧任务结束时间 ${oldTime},新任务结束时间 ${newTime}。`;
    }
    if (oldData.acceptor != param.acceptor) {
        result.str += ` 旧验收人 ${users[oldData.acceptor] ? users[oldData.acceptor].username : ''},新验收人 ${users[param.acceptor] ? users[param.acceptor].username : ''}。`;
    }
    if (oldData.executors != param.executors) {
        result.timeAlert = true;
        result.str += ` 旧执行人 ${users[oldData.executors] ? users[oldData.executors].username : ''},新旧执行人 ${users[param.executors] ? users[param.executors].username : ''}。`;
    }
    // 对比协助人是否改变
    let oldid = [],
        newId = [];
    if (param.person && param.person.length) {
        param.person.forEach(item => {
            newId.push(item);
        });
    }
    person.forEach(item => {
        oldid.push(item.user_id);
    });
    console.log('----------------', oldid.join(), newId.join(), 'param.person', param.person);
    if (oldid.join() != newId.join()) {
        result.str += '旧协助人： ';
        oldid.forEach(item => {
            result.str += users[item] ? `${users[item].username},` : '';
        });
        result.str += '。新协助人： ';
        newId.forEach(item => {
            result.str += users[item] ? `${users[item].username},` : '';
        });
        result.str += '。';
    }
    return result;
}


/**
 * 任务顺延处理
 */
async function taskPostponement(param, transaction, token) {
    const { start_time, end_time, id, product_id, title } = param;
    // 获取所有结束时间大于，需修改任务开始时间的任务。（需要进行顺延的所有任务）
    const task = await models.task.findAll({
        where: {
            product_id,
            end_time: { $gt: start_time },
            executors: param.executors,
            status: 1
        },
        order: [['start_time', 'asc']],
        raw: true
    });
    const updateTask = [];
    if (task && task.length) {
        // 需要更改任务时间的任务集合
        task.forEach((item, index) => {
            let userTime = 0;
            if (index == 0) {
                // 如果任务开始时间大于上个任务的结束时间后续就不需要修改了
                if (item.start_time >= end_time) {
                    return;
                }
                userTime = item.end_time - item.start_time;
                item.start_time = end_time;
            } else {
                // 如果任务开始时间大于上个任务的结束时间后续就不需要修改了
                if (item.start_time >= task[index - 1].end_time) {
                    return;
                }
                userTime = item.end_time - item.start_time;
                item.start_time = task[index - 1].end_time;
            }
            // 记录一下旧的开始和结束时间，下方记录修改日志的时候使用
            item.old_start_time = item.start_time;
            item.old_end_time = item.end_time;

            item.end_time = item.start_time + userTime;
            let endDate = new Date(item.end_time * 1000);
            // 如果结束时间为晚上6点后则顺延到第二天
            if (endDate.getHours() > 17) {
                endDate.setDate(endDate.getDate() + 1);
                endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 9);
                // 如果碰到星期天则在顺延一天
                if (endDate.getDay() == 0) {
                    endDate.setDate(endDate.getDate() + 1);
                }
                item.start_time = endDate.getTime() / 1000;
                item.end_time = item.start_time + userTime;
            }
            updateTask.push(item);
        });
    }
    // 存在需要顺延的数据
    if (updateTask.length) {
        const time = dayjs().unix();
        // 任务修改记录
        const records = [];
        const ids = [];
        // 修改任务时间sql
        let sql = ' UPDATE task set start_time=CASE id  ';
        let sqlEnd = ' END, end_time = CASE id ';
        updateTask.forEach(item => {
            sql += ` WHEN ${item.id} THEN ${item.start_time} `;
            sqlEnd += ` WHEN ${item.id} THEN ${item.end_time} `;
            ids.push(item.id);
            // 修改记录添加
            records.push({
                product_id: param.product_id,
                task_id: item.id,
                type: 2,
                message: `旧开始时间：${dayjs(item.old_start_time * 1000).format('YYYY-MM-DD HH:mm:ss')},新开始时间：${dayjs(item.tart_time * 1000).format('YYYY-MM-DD HH:mm:ss')}旧结束时间：${dayjs(item.old_end_time * 1000).format('YYYY-MM-DD HH:mm:ss')},新结束时间：${dayjs(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`,
                user_id: token.uid,
                reason: `任务id:${id},任务标题:${title},修改任务时间导致后续任务自动顺延`,
                create_time: time
            });
        });
        sql += `${sqlEnd} END WHERE id in (${ids}) `;
        // 执行sql
        await models.sequelize.query(sql, { transaction });
        await models.alert_record.bulkCreate(records, { transaction });
    }
}