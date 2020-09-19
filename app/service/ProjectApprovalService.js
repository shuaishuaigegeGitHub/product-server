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
            manage_name: params.manage_name,
            update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            month: dayjs().format("YYYY-MM"),
            game_start: params.game_start,
            game_end: params.game_end,
            product_name: params.product_name,
        }, {
            where: {
                id: params.id
            },
            transaction
        });

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
export const addTask = async (params) => {
    await models.lx_task.create({
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
        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        predict_start_time: params.predict_start_time,
        predict_end_time: params.predict_end_time,
        reality_start_time: params.reality_start_time,
        reality_end_time: params.reality_end_time,
        manage_id: params.manage_id,
        manage_name: params.manage_name
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
    if (params.manage_id) {
        where.manage_id = params.manage_id;
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
    let t3Date = " t3.provide_id,t3.provide_name,t3.project_type,t3.technology_type,t3.weight,t3.source,t3.theme,t3.starting,t3.person,t3.reason,t3.innovate_synopsis,t3.innovate_target,t3.original_name,t3.manufacturer_name,t3.game_connection,t3.achievement_description,t3.game_description,t3.user_group,t3.play_theme,t3.game_difficulty,t3.game_type,t3.interest,t3.point_design,t3.original_time,t3.original_remark,t3.picture_quality,t3.handle_feeling,t3.reduction_degree ";
    let sql = ` select t1.*,${t3Date} from lx_product t1 left join lx_person t2 on t2.product_id=t1.id left join po_product t3 on t3.id=t1.product_pool_id  WHERE (t1.manage_id=${uid} OR t2.user_id=${uid} or t1.plan_manage_id=${uid}  )  `;
    let object = {
        "manage_id$=": params.manage_id,
        "manage_name$l": params.manage_name ? "%" + params.manage_name + "%" : undefined,
        "create_time$b": params.time,
        "month=": params.month,
        "status$=": params.status,
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
        result.forEach(item => {
            ids.push(item.id);
        });
        let users = await models.lx_person.findAll({
            where: {
                product_id: { $in: ids }
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
        result.forEach(item => {
            let users = userMap[item.id];
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
    let { id, artPerson, codePerson, planPerson, operatePerson } = params;
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
        console.log("===========", bulk);

        await models.lx_person.bulkCreate(bulk, { transaction });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "保存成功" };
    } catch (error) {
        console.log("产品立项保存人员错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存错误" };
    }

};