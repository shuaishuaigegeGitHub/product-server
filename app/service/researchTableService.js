// 研发列表
import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { delFile } from "../util/localOperationFile";
import { sqlAppent } from "../util/sqlAppent";

/**
 * 初始化
 */
export const init = async (param) => {
    let [functs, transaction] = [[], await models.sequelize.transaction()];
    try {
        // 更新主表信息
        functs.push(
            models.product.update({
                initialization: 2,
                APPID: param.APPID,
                APPKEY: param.APPKEY,
                webhook: param.webhook
            }, {
                where: {
                    id: param.id
                },
                transaction
            })
        );
        // 往分组表里添加四个分组
        let bulk = [
            {
                product_id: param.id,
                group_name: "程序组"
            },
            {
                product_id: param.id,
                group_name: "美术组"
            },
            {
                product_id: param.id,
                group_name: "策划组"
            },
            {
                product_id: param.id,
                group_name: "运营组"
            }
        ];
        functs.push(
            models.task_group.bulkCreate(bulk, { transaction })
        );
        // 调用游戏自动创建数据库接口（暂无） 
        await Promise.all(functs);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "初始化成功" };
    } catch (error) {
        console.log("初始化错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "初始化错误" };
    }

};

/**
 * 保存基础配置
 */
export const basic_Configuration = async (param) => {
    models.product.update({
        APPID: param.APPID,
        APPKEY: param.APPKEY,
        webhook: param.webhook
    }, {
        where: {
            id: param.id
        },
        transaction
    });
    return { code: RESULT_SUCCESS, msg: "保存成功" };
};
/**
 * 保存人员配置
 */
export const personSave = async (param) => {
    let transaction = await models.sequelize.transaction();
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
        let persons = [];
        // 美术
        if (param.painting && param.painting.length) {
            param.painting.forEach(item => {
                persons.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 1,
                    product_id: param.id
                });
            });
        }
        // 程序
        if (param.program && param.program.length) {
            param.program.forEach(item => {
                persons.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 2,
                    product_id: param.id
                });
            });
        }
        // 策划
        if (param.plan && param.plan.length) {
            param.plan.forEach(item => {
                persons.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 2,
                    product_id: param.id
                });
            });
        }
        // 运营
        if (param.operate && param.operate.length) {
            param.operate.forEach(item => {
                persons.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 2,
                    product_id: param.id
                });
            });
        }
        await models.person.bulkCreate(persons, { transaction });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存人员配置成功" };
    } catch (error) {
        console.log("保存人员配置错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存人员配置错误" };
    }
};
/**
 * 生成里程碑
 */
export const fixedFile = async (param) => {
    try {
        // 查询分组
        let groups = await models.task_group.findAll({
            where: {
                product_id: param.id,
                type: { $in: [1, 2] }
            },
            raw: true,
        });
        if (!groups || !groups.length) {
            return { code: RESULT_ERROR, msg: "项目未初始化请先初始化" };
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
        let tasks = await models.task.findAll({
            where: {
                product_id: param.id,
                group_id: { $in: [cx, ms] }
            },
            raw: true,
            order: [
                ["start_time", "asc"]
            ]
        });
        if (!tasks || !tasks.length) {
            return { code: RESULT_ERROR, msg: "生成里程碑失败请先创建任务" };
        }
        // 程序介入日期,程序完成日期,美术介入日期,美术完成日期
        let [program_intervention_time, program_end_time, art_intervention_time, art_end_time] = [0, 0, 0, 0];
        tasks.forEach(item => {
            if (item.group_id == cx) {
                if (!program_intervention_time) {
                    program_intervention_time = item.start_time;
                }
                program_end_time = item.start_time;
            } else if (item.group_id == ms) {
                if (!art_intervention_time) {
                    art_intervention_time = item.start_time;
                }
                art_end_time = item.start_time;
            }
        });
        // 更新数据
        await models.sequelize.query("  UPDATE product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id set t1.fixed_file=2,t2.program_intervention_time=?,t2.program_end_time=?,t2.art_intervention_time=?,t2.art_end_time=? WHERE t1.id=? ",
            { replacements: [program_intervention_time, program_end_time, art_intervention_time, art_end_time, param.id], type: models.UPDATE }
        );

        return { code: RESULT_SUCCESS, msg: "生成里程碑成功" };
    } catch (error) {
        console.log("生成里程碑错误", error);

        return { code: RESULT_ERROR, msg: "生成里程碑错误" };
    }
};

/**
 * 保存里程碑
 */
export const updateMilepost = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 保存里程碑数据
        await models.product_schedule.update({
            selection_time: param.selection_time ? parseInt(param.selection_time / 1000) : undefined,
            project_approval_time: param.project_approval_time ? parseInt(param.project_approval_time / 1000) : undefined,
            file_complete_time: param.file_complete_time ? parseInt(param.file_complete_time / 1000) : undefined,
            strat_up_time: param.strat_up_time ? parseInt(param.strat_up_time / 1000) : undefined,
            program_intervention_time: param.program_intervention_time ? parseInt(param.program_intervention_time / 1000) : undefined,
            program_end_time: param.program_end_time ? parseInt(param.program_end_time / 1000) : undefined,
            art_intervention_time: paramart_intervention_time ? parseInt(param.paramart_intervention_time / 1000) : undefined,
            art_end_time: param.art_end_time ? parseInt(param.art_end_time / 1000) : undefined,
            core_functions_time: param.core_functions_time ? parseInt(param.core_functions_time / 1000) : undefined,
            demo_time: param.demo_time ? parseInt(param.demo_time / 1000) : undefined,
            experience_time: param.experience_time ? parseInt(param.experience_time / 1000) : undefined,
            transfer_operation_time: param.transfer_operation_time ? parseInt(param.transfer_operation_time / 1000) : undefined,
            extension_time: param.extension_time ? parseInt(param.extension_time / 1000) : undefined,
        }, {
            where: {
                product_id: param.id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存里程碑成功" };
    } catch (error) {
        console.log("保存里程碑错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存里程碑错误" };
    }
};
/**
 * 文件管理文件查询
 */
export const findManageFileAll = async (param) => {
    let files = await models.file.findAll({
        where: {
            product_id: param.id,
            type: { $gt: 2 }
        },
        raw: true
    });
    let result = [];
    let fileType = {};
    if (files && files.length) {
        files.forEach(item => {
            if (fileType[item.type]) {
                fileType[item.type].push(item);
            } else {
                fileType[item.type] = [item];
            }
        });
    }
    let types = Object.keys(fileType);
    if (types && types.length) {
        let folderName = "";
        types.forEach(item => {
            switch (item + "") {
                case "3":
                    folderName = "会议记录";
                    break;
                case "4":
                    folderName = "游戏截图";
                    break;
                case "5":
                    folderName = "游戏玩法视频";
                    break;
                case "6":
                    folderName = "策划文案";
                    break;
                case "7":
                    folderName = "启动会，会议议记录";
                    break;
                case "8":
                    folderName = "任务附件";
                    break;
                case "9":
                    folderName = "demo版会议记录";
                    break;
            }
            result.push({ folderName: folderName, files: fileType[item] });
        });
    }
    return { code: RESULT_SUCCESS, data: result, msg: "获取文件成功" };
};

/**
 * 添加分组
 */
export const addGroup = async (param) => {
    await models.task_group.create({
        product_id: param.product_id,
        group_name: param.group_name
    });
    return { code: RESULT_SUCCESS, data: result, msg: "添加分组成功" };
};
/**
 * 修改分组
 */
export const updateGroup = async (param) => {
    if (!param.type || !param.id) {
        return { code: RESULT_ERROR, data: result, msg: "删除分组失败，参数错误" };
    }
    if (param.type > 0) {
        return { code: RESULT_ERROR, data: result, msg: "删除分组失败，系统默认分组禁止修改" };
    }
    await models.task_group.update({
        group_name: param.group_name
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, data: result, msg: "修改分组成功" };
};
/**
 * 删除分组
 */
export const updateGroup = async (param) => {
    if (!param.type || !param.id) {
        return { code: RESULT_ERROR, data: result, msg: "删除分组失败，参数错误" };
    }
    if (param.type > 0) {
        return { code: RESULT_ERROR, data: result, msg: "删除分组失败，系统默认分组禁止删除" };
    }
    // 判断分组下是否有任务
    let task = await models.task.count({
        where: {
            group_id: param.id,
            status: { lt: 3 }
        }
    });
    console.log("==============task", task);
    if (task[0].count > 0) {
        return { code: RESULT_ERROR, data: result, msg: "删除分组失败，分组下存在任务禁止删除" };
    }
    await models.task_group.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, data: result, msg: "删除分组成功" };
};

/**
 * 添加任务
 */
export const addTask = async (param, token) => {
    param.start_time = param.start_time ? parseInt(param.start_time / 100) : undefined;
    param.end_time = param.end_time ? parseInt(param.end_time / 1000) : undefined;
    // 如果添加的任务包含执行时间和执行人则效验任务时间是否冲突
    if (param.start_time && param.end_time.length && param.executor && param.executor.length) {
        let pesrsons = param.executor.map(item => {
            return item.id;
        });
        let sql = ` SELECT count(1) as count FROM task t1 LEFT JOIN task_person t2 ON t1.id=t2.task_id AND t2.user_id IN (${pesrsons}) WHERE t1.product_id=${param.product_id} and t1.tatus=1 and ( ((t1.start_time<=${param.start_time} AND t1.end_time> ${param.start_time} ) OR (t1.start_time< ${param.end_time} AND t1.end_time>=${param.end_time} )) OR (t1.start_time> ${param.start_time}  AND t1.end_time< ${param.end_time} ) )`;
        let result = await models.sequelize.query(sql, { type: models.SELECT });
        if (result[0].count) {
            return { code: RESULT_ERROR, data: result, msg: "添加任务失败任务时间冲突" };
        }
    }
    let transaction = await models.sequelize.transaction();
    try {
        if (param.fixed_file) {
            // 是否已生成里程碑，生成里程碑后增加需要记录
            if (param.fixed_file == 2) {
                let record = {
                    product_id: param.product_id,
                    type: 2,
                    message: "增加任务。任务标题：" + param.title + "，任务描述：" + param.describe,
                    user_id: token.uid,
                    reason: param.reason,
                    create_time: dayjs().unix()
                };
            }
            await models.alert_record.create(record, { transaction });
        } else {
            return { code: RESULT_ERROR, data: result, msg: "参数错误，是否已生成里程碑" };
        }
        // 保存任务
        let taskResult = await models.task.create({
            product_id: param.product_id,
            group_id: param.group_id,
            label: param.label,
            title: param.title,
            describe: param.describe,
            start_time: param.start_time,
            end_time: param.end_time,
        }, { transaction });
        taskResult = taskResult.get();
        // 有设置人员添加人员
        if (param.executor && param.executor) {
            let pesrson = [];
            param.executor.forEach(item => {
                pesrson.push({
                    task_id: taskResult.id,
                    user_id: item.user_id
                });
            });
            await models.task_person.bulkCreate(pesrson, { transaction });
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "添加任务成功" };
    } catch (error) {
        console.log("添加任务错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "添加任务错误" };
    }
};
/**
 *更新任务
 */
export const updateTask = async (param, token) => {
    param.start_time = param.start_time ? parseInt(param.start_time / 100) : undefined;
    param.end_time = param.end_time ? parseInt(param.end_time / 1000) : undefined;
    // 如果添加的任务包含执行时间和执行人则效验任务时间是否冲突
    if (param.start_time && param.end_time.length && param.executor && param.executor.length) {
        let pesrsons = param.executor.map(item => {
            return item.id;
        });
        let sql = ` SELECT count(1) as count FROM task t1 LEFT JOIN task_person t2 ON t1.id=t2.task_id AND t2.user_id IN (${pesrsons}) WHERE t1.product_id=${param.product_id} and t1.status=1 and  ( ((t1.start_time<=${param.start_time} AND t1.end_time> ${param.start_time} ) OR (t1.start_time< ${param.end_time} AND t1.end_time>=${param.end_time} )) OR (t1.start_time> ${param.start_time}  AND t1.end_time< ${param.end_time} ) )`;
        let result = await models.sequelize.query(sql, { type: models.SELECT });
        if (result[0].count) {
            return { code: RESULT_ERROR, data: result, msg: "添加任务失败任务时间冲突" };
        }
    }
    let transaction = await models.sequelize.transaction();
    let functs = [];
    try {

        if (param.fixed_file) {
            // 是否已生成里程碑，生成里程碑后修改需要记录
            if (param.fixed_file == 2) {
                if (!param.reason) {
                    return { code: RESULT_ERROR, data: result, msg: "参数错误，请填写修改理由" };
                }
            }
        } else {
            return { code: RESULT_ERROR, data: result, msg: "参数错误，是否已生成里程碑" };
        }
        // 保存任务
        functs.push(models.task.update({
            product_id: param.product_id,
            group_id: param.group_id,
            label: param.label,
            title: param.title,
            describe: param.describe,
            start_time: param.start_time,
            end_time: param.end_time,
        }, {
            where: {
                id: param.id
            },
            transaction
        }));
        // 有设置人员添加人员
        if (param.executor && param.executor) {
            let pesrson = [];
            param.executor.forEach(item => {
                pesrson.push({
                    task_id: param.id,
                    user_id: item.user_id
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
            functs.push(models.task_person.bulkCreate(pesrson, { transaction }));
        }
        await Promise.all(functs);
        param.delFile.forEach(item => {
            delFile(item.url);
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "更新任务成功" };
    } catch (error) {
        console.log("更新任务错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "更新任务错误" };
    }
};
/**
 * 任务添加附件
 */
export const taskAddFile = async (param) => {
    await models.file.create({
        task_id: param.task_id,
        type: 8,
        name: item.name,
        url: item.url,
        size: item.size,
        create_time: dayjs.unix()
    });
    return { code: RESULT_SUCCESS, msg: "任务添加附件成功" };
};
/**
 * 任务删除附件
 */
export const taskAddFile = async (param) => {
    let transaction = await models.sequelize.transaction();
    await models.file.destroy({
        where: {
            id: param.id
        }, transaction
    });
    let reslut = delFile(param.url);
    if (reslut.code != RESULT_SUCCESS) {
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "任务删除附件失败" };
    }
    await transaction.commit();
    return { code: RESULT_SUCCESS, msg: "任务删除附件成功" };
};
/**
 * 添加子任务
 */
export const addSubset = async (param) => {
    await models.task_subset.create({
        task_id: param.task_id,
        message: param.message
    });
    return { code: RESULT_SUCCESS, msg: "添加子任务成功" };
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
    return { code: RESULT_SUCCESS, msg: "添加子任务成功" };
};
/**
 * 添加评论
 */
export const addComment = async (param, token) => {
    let task = await models.task.findOne({
        where: {
            id: param.id
        }
    });
    let comment = "", time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (task.comment && task.comment.length) {
        let commentArr = JSON.parse(task.comment);
        commentArr.push({
            time: time,
            message: param.message,
            userid: token.uid,
            username: token.userName,
            avatar: token.avatar
        });
        comment = JSON.stringify(commentArr);
    } else {
        comment = JSON.stringify([{
            time: time,
            message: param.message,
            userid: token.uid,
            username: token.userName,
            avatar: token.avatar
        }]);
    }
    await models.task.update({
        comment: comment
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "添加评论成功" };
};


/**
 * 效验任务修改内容
 */
async function checkTaskAlert(param) {
    let oldData = await models.task.findOne({ where: { id: param.id } });
    let str = "修改内容为：";
    if (oldData.title != param.title) {
        str += `  `;
    }
}