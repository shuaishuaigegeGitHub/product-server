import models from '../models';
import dayjs from "dayjs";
import { sqlAppent } from "../util/sqlAppent";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';

/**
 * 更新产品数据
 */
export const updateProduct = async (params) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 更新主表
        await models.lx_product.update({
            manage_id: params.manage_id,
            update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            game_start: params.game_start,
            game_end: params.game_end,
        }, {
            where: {
                id: params.id
            },
            transaction
        });
        // 更新产品
        await models.po_product.update({
            update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            product_name: params.product_name,
            pool_id: params.pool_id,
            priority: params.priority,
            provide_id: params.provide_id,
            provide_name: params.provide_name,
            project_type: params.project_type,
            technology_type: params.technology_type,
            weight: params.weight,
            source: params.source,
            theme: params.theme,
            starting: params.starting,
            person: params.person,
            reason: params.reason,
            innovate_synopsis: params.innovate_synopsis,
            innovate_target: params.innovate_target,
            original_name: params.original_name,
            manufacturer_name: params.manufacturer_name,
            game_connection: params.game_connection,
            achievement_description: params.achievement_description,
            game_description: params.game_description,
            user_group: params.user_group,
            play_theme: params.play_theme,
            game_difficulty: params.game_difficulty,
            game_type: params.game_type,
            interest: params.interest,
            point_design: params.point_design,
            original_time: params.original_time,
            original_remark: params.original_remark,
        }, {
            where: {
                id: params.product_pool_id
            },
            transaction
        });
        // 删除logo，二维码，然后重新保存
        await models.po_file.destroy({
            where: {
                product_id: params.product_pool_id,
                type: { $in: [1] }
            },
            transaction
        });
        // 存在被删除的文件
        if (params.delFiles && params.delFiles.length) {
            await models.po_file.destroy({
                where: {
                    id: { $in: params.delFiles }
                },
                transaction
            });
        }

        // 保存文件
        if (params.fileList && params.fileList.length) {
            let fiels = [];
            params.fileList.forEach(item => {
                fiels.push({
                    type: item.type,
                    name: item.name,
                    path: item.path,
                    size: item.size,
                    product_id: params.product_pool_id,
                    create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                });
            });
            await models.po_file.bulkCreate(fiels, { transaction });

        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "更新成功" };
    } catch (error) {
        console.log("更新立项产品数据失败", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "更新错误" };
    }
};
/**
 * 更改产品状态
 */
export const productStatus = async (params) => {
    // 更新主表
    await models.lx_product.update({
        status: params.status
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "更新成功" };
};

/**
 * 添加任务
 * @param {*} params 
 */
export const addTask = async (params, token) => {
    await models.lx_task.create({
        project_id: params.project_id,
        task_name: params.task_name,
        priority: params.priority,
        task_detail: params.task_detail,
        task_user_id: token.uid,
        task_username: token.userName,
        acceptor_id: params.acceptor_id,
        acceptor_username: params.acceptor_username,
        begin_time: params.begin_time,
        end_time: params.end_time,
        state: params.state,
        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        reality_start_time: params.reality_start_time,
        reality_end_time: params.reality_end_time,
    });
    return { code: RESULT_SUCCESS, msg: "添加任务成功" };
};

/**
 * 修改任务
 * @param {*} params 
 */
export const updateTask = async (params) => {
    await models.lx_task.update({
        project_id: params.project_id,
        task_type: params.task_type,
        module_id: params.module_id,
        task_name: params.task_name,
        priority: params.priority,
        task_detail: params.task_detail,
        task_user_id: params.task_user_id,
        task_username: params.task_username,
        acceptor_id: params.acceptor_id,
        acceptor_username: params.acceptor_username,
        begin_time: params.begin_time,
        end_time: params.end_time,
        state: params.state,
        update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        predict_start_time: params.predict_start_time,
        predict_end_time: params.predict_end_time,
        reality_start_time: params.reality_start_time,
        reality_end_time: params.reality_end_time,
        manage_id: params.manage_id,
        manage_name: params.manage_name
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "修改任务成功" };
};

/**
 * 验收任务
 * @param {*} params 
 */
export const checkTask = async (params) => {
    await models.lx_task.update({
        check: params.check,
        check_remark: params.check_remark,
        acceptor_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "验收任务成功" };
};
/**
 * 删除任务
 * @param {*} params 
 */
export const delTask = async (params) => {
    await models.lx_task.destroy({
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除任务成功" };
};
/**
 * 查询任务
 */
export const findTask = async (params) => {
    let where = {
        project_id: params.project_id,

    };
    if (params.task_user_id) {
        where.task_user_id = params.task_user_id;
    }
    let result = await models.lx_task.findAll({
        where
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 查询产品数据
 */
export const searchProduct = async (params, token) => {
    let uid = token.uid;
    let t3Date = "t3.product_name,t3.priority, t3.provide_id,t3.provide_name,t3.project_type,t3.technology_type,t3.weight,t3.source,t3.theme,t3.starting,t3.person,t3.reason,t3.innovate_synopsis,t3.innovate_target,t3.original_name,t3.manufacturer_name,t3.game_connection,t3.achievement_description,t3.game_description,t3.user_group,t3.play_theme,t3.game_difficulty,t3.game_type,t3.interest,t3.point_design,t3.original_time,t3.original_remark,t3.picture_quality,t3.handle_feeling,t3.reduction_degree ";
    let sql = ` select t1.*,${t3Date} from lx_product t1 left join lx_person t2 on t2.product_id=t1.id left join po_product t3 on t3.id=t1.product_pool_id  WHERE (t1.manage_id=${uid} OR t2.user_id=${uid} or t1.plan_manage_id=${uid}  )  `;
    let object = {
        "manage_id$=": params.manage_id,
        "manage_name$l": params.manage_name ? "%" + params.manage_name + "%" : undefined,
        "create_time$b": params.time,
        "month=": params.month,
        "status$<": 6,
        "product_pool_id$=": params.product_pool_id,
        "del$=": params.del || 1
    },
        sqlMap = {
            "manage_id": "t1.manage_id",
            "manage_name": "t1.manage_name",
            "create_time": "t1.create_time",
            "month": "t1.month",
            "status": "t1.status",
            "product_pool_id": "t1.product_pool_id"
        };
    let sqlResult = sqlAppent(object, sqlMap, sql);
    sql += sqlResult.sql;
    sql += " group by t1.id ";
    let result = await models.sequelize.query(sql, { replacements: sqlResult.param, type: models.SELECT });
    if (result) {
        let ids = [];
        let product_pool_ids = [];
        result.forEach(item => {
            ids.push(item.id);
            product_pool_ids.push(item.product_pool_id);
        });
        let users = await models.lx_person.findAll({
            where: {
                product_id: { $in: ids }
            }
        });
        let files = await models.po_file.findAll({
            where: {
                product_id: { $in: product_pool_ids }
            }
        });
        let userMap = {};

        if (users && users.length) {
            users.forEach(item => {
                if (userMap[item.product_id]) {
                    userMap[item.product_id].push(item);
                } else {
                    userMap[item.product_id] = [item];
                }
            });
        }
        // 文件数据处理
        let fileMap = {};
        if (files && files.length) {
            files.forEach(item => {
                if (fileMap[item.product_id]) {
                    fileMap[item.product_id].push(item);
                } else {
                    fileMap[item.product_id] = [item];
                }
            });
        }
        // 人员列表数据处理
        result.forEach(item => {
            let users = userMap[item.id];
            item.fileList = fileMap[item.product_pool_id];
            //  美术人员列表
            item.artPerson = [];
            // 程序人员列表
            item.codePerson = [];
            //  策划人员列表
            item.planPerson = [];
            //  运营人员列表
            item.operatePerson = [];
            if (users && users.length) {
                users.forEach(it => {
                    switch (it.type) {
                        case 1:
                            item.artPerson.push(it);
                            break;
                        case 2:
                            item.codePerson.push(it);
                            break;
                        case 3:
                            item.planPerson.push(it);
                            break;
                        case 4:
                            item.operatePerson.push(it);
                            break;
                    }
                });
            }
        });
        return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
    }
    return { code: RESULT_ERROR, msg: "查询失败" };
};
/**
 * 保存人员配置
 */
export const savePerson = async (params) => {
    let { id, artPerson, codePerson, planPerson, operatePerson, mainCourse } = params;
    if (!id) {
        return { code: RESULT_ERROR, msg: "保存失败,参数不全" };
    }
    let transaction = await models.sequelize.transaction();
    try {
        // 删除人员
        await models.lx_person.destroy({
            where: {
                product_id: id
            },
            transaction
        });
        let bulk = [];

        // 美术人员列表
        if (artPerson && artPerson.length) {
            artPerson.forEach(item => {
                bulk.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 1,
                    product_id: id
                });
            });
        }
        // 程序人员列表
        if (codePerson && codePerson.length) {
            codePerson.forEach(item => {
                bulk.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 2,
                    product_id: id
                });
            });
        }
        //  策划人员列表
        if (planPerson && planPerson.length) {
            planPerson.forEach(item => {
                bulk.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 3,
                    product_id: id
                });
            });
        }
        // 运营列表
        if (operatePerson && operatePerson.length) {
            operatePerson.forEach(item => {
                bulk.push({
                    user_id: item.user_id,
                    user_name: item.user_name,
                    type: 4,
                    product_id: id
                });
            });
        }
        // 更新主程
        if (mainCourse) {
            await models.lx_product.update({
                main_course: mainCourse.user_id,
                main_course_name: mainCourse.user_name
            }, {
                where: {
                    id: id
                },
                transaction
            });
        }
        await models.lx_person.bulkCreate(bulk, { transaction });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存成功" };
    } catch (error) {
        console.log("产品立项保存人员错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存错误" };
    }

};

/**
 * 一键审批
 * @param {*} params 
 */

export const bulkVerify = async (params) => {
    let { ids } = params;
    if (!ids) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    await models.lx_task.update({
        state: 6,
    }, {
        where: {
            project_id: ids
        }
    });
    await models.lx_product.update({
        status: 6,
    }, {
        where: {
            id: ids
        }
    });
    return { code: RESULT_SUCCESS, msg: "审批成功" };

};

/**
 * 保存里程
 */
export const saveMileage = async (params) => {
    let { product_id, userData } = params;
    if (userData && userData.length && product_id) {
        let data = [];
        userData.forEach(item => {
            data.push({
                users: JSON.stringify(item.users),
                type: item.type,
                time: item.time,
                product_id: product_id
            });
        });
        try {
            let transaction = await models.sequelize.transaction();
            await models.lx_mileage.destroy({
                where: {
                    product_id: product_id
                },
                transaction
            });
            await models.lx_mileage.bulkCreate(data, { transaction });
            await transaction.commit();
            return { code: RESULT_SUCCESS, msg: "保存成功" };
        } catch (error) {
            console.log("里程碑保存失败", error);
            await transaction.rollback();
            return { code: RESULT_SUCCESS, msg: "保存错误" };
        }

    } else {
        return { code: RESULT_SUCCESS, msg: "参数错误" };
    }
};

/**
 * 查询里程
 */
export const searchMileage = async (params) => {
    // 里程数据
    let mileage = await models.lx_mileage.findAll({
        where: {
            product_id: params.product_id
        }
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: mileage };
};
/**
 * 负责人按日期，任务负责人查询任务
 * @param {*} params 
 */
export const manageSearchTask = async (params) => {
    let task = await models.lx_task.findAll({
        where: {
            begin_time: { $gte: params.begin_time, $lte: params.end_time },
            project_id: params.project_id
        },
        raw: true
    });
    let result = {};
    task.forEach(item => {
        let time = dayjs(item.begin_time * 1000).format("YYYY-MM-DD");
        if (result[time]) {
            if (result[time][item.task_username]) {
                result[time][item.task_username].push(item);
            } else {
                result[time][item.task_username] = [item];
            }
        } else {
            let object = {};
            object[item.task_username] = [item];
            result[time] = object;
        }
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 项目参与者按日期查询自己的任务
 */
export const userFimdTask = async (params) => {
    let task = await models.lx_task.findAll({
        where: {
            begin_time: { $gte: params.begin_time, $lte: params.end_time },
            project_id: params.project_id,
            task_user_id: params.task_user_id
        },
        raw: true
    });
    let result = {};
    task.forEach(item => {
        let time = dayjs(item.begin_time * 1000).format("YYYY-MM-DD");
        if (result[time]) {
            result[time].push(item);
        } else {
            result[time] = [item];
        }
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};