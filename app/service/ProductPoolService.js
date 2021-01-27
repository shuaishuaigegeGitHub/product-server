// 产品池
import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from '../util/sqlAppent';
import { delFile } from '../util/localOperationFile';
import { isPermission } from './PermissionService';

/**
 * 产品池添加项目保存
 * @param {*} param
 * @param {*} token
 */
export const add = async (param, token) => {
    if (param.poll) {
        if (isNaN(param.poll)) {
            return { code: RESULT_ERROR, msg: '票数请输入数字' };
        }
    } else {
        param.poll = undefined;
    }
    console.log('===产品池添加项目保存===', param);
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    try {
        // 保存产品主表
        let result = await models.product.create({
            create_time: time,
            product_name: param.product_name,
            status: 1,
            del: 1,
            provide_id: param.provide_id,
            input_user_id: token.uid,
        }, { transaction });
        result = result.get();
        // 保存基本数据s
        await models.product_base.create({
            product_id: result.id,
            priority: 1,
            project_type: param.project_type,
            technology_type: param.technology_type,
            game_type: param.game_type,
            theme: param.theme,
            play_theme: param.play_theme,
            starting: param.starting,
            source: param.source,
            poll: param.poll,
            project_selection: param.project_selection || undefined,
            pool_id: param.pool_id || undefined,
            location: param.location || undefined,
            game_description: param.game_description,
            user_group: param.user_group,
            age: param.age,
            gender: param.gender,
            game_difficulty: param.game_difficulty,
            interest: param.interest,
            point_design: param.point_design,
            optimization: param.optimization,
            analysis_conclusion: param.analysis_conclusion,
            inspiration: param.inspiration,
            weight_handle_feeling: param.weight_handle_feeling,
            weight_game_level: param.weight_game_level,
            weight_art_action: param.weight_art_action,
            weight_art_special: param.weight_art_special,
            weight_sound_effect: param.weight_sound_effect,
            weight_picture_quality: param.weight_picture_quality,
            original_name: param.original_name,
            manufacturer_name: param.manufacturer_name,
            game_connection: param.game_connection,
            original_time: param.original_time,
            achievement_description: param.achievement_description,
            original_remark: param.original_remark,
        }, { transaction });
        // 保存附表文件，保存选品通过时间
        await models.product_schedule.create({
            product_id: result.id,
            selection_time: time
        }, { transaction });
        // 保存文件
        if (param.addFiels && param.addFiels.length) {
            const fiels = [];
            param.addFiels.forEach(item => {
                fiels.push({
                    product_id: result.id,
                    type: item.type,
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    create_time: time
                });
            });

            await models.file.bulkCreate(fiels, { transaction });
        }
        // 存在删除文件
        if (param.delFiles && param.delFiles.length) {
            let urls = [];
            param.delFiles.forEach(item => {
                delFile(item.url);
                urls.push(item.url);
            });
            await models.file.destroy({
                where: {
                    url: { $in: urls }
                }
            }, { transaction });
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '添加成功' };
    } catch (error) {
        console.log('产品池添加项目保存错误：', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '添加错误' };
    }
};


/**
 * 产品池更新项目
 * @param {*} param
 * @param {*} token
 */
export const update = async (param, token) => {
    console.log('===产品池更新项目===', param);
    if (param.poll) {
        if (isNaN(param.poll)) {
            return { code: RESULT_ERROR, msg: '票数请输入数字' };
        }
    } else {
        param.poll = undefined;
    }
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    try {
        // 更新产品主表
        const result = await models.product.update({

            update_time: time,

            product_name: param.product_name,



            provide_id: param.provide_id,

            input_user_id: token.uid,

        }, {
            where: {
                id: param.id
            },
            transaction
        });
        // 更新基本数据
        await models.product_base.update({


            priority: param.priority,

            project_type: param.project_type,

            technology_type: param.technology_type,

            game_type: param.game_type,

            theme: param.theme,

            play_theme: param.play_theme,

            starting: param.starting,

            source: param.source,

            poll: param.poll,

            project_selection: param.project_selection || undefined,
            pool_id: param.pool_id || undefined,
            location: param.location || undefined,
            game_description: param.game_description,

            user_group: param.user_group,

            age: param.age,

            gender: param.gender,

            game_difficulty: param.game_difficulty,

            interest: param.interest,

            point_design: param.point_design,

            optimization: param.optimization,

            analysis_conclusion: param.analysis_conclusion,

            inspiration: param.inspiration,

            weight_handle_feeling: param.weight_handle_feeling,

            weight_game_level: param.weight_game_level,

            weight_art_action: param.weight_art_action,

            weight_art_special: param.weight_art_special,

            weight_sound_effect: param.weight_sound_effect,

            weight_picture_quality: param.weight_picture_quality,

            original_name: param.original_name,

            manufacturer_name: param.manufacturer_name,

            game_connection: param.game_connection,

            original_time: param.original_time,

            achievement_description: param.achievement_description,

            original_remark: param.original_remark,

        }, {
            where: {
                product_id: param.id
            },
            transaction
        });
        // 删除文件
        if (param.delFIles && param.delFIles.length) {
            const urls = [];
            param.delFIles.forEach(item => {
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
        if (param.addFiels && param.addFiels.length) {
            const fiels = [];
            param.addFiels.forEach(item => {
                fiels.push({
                    product_id: param.id,
                    type: item.type,
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    create_time: time
                });
            });
            await models.file.bulkCreate(fiels, { transaction });
        }

        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '修改成功' };
    } catch (error) {
        console.log('产品池更新项目更新错误：', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '更新错误' };
    }
};

/**
 * 作废
 * @param {*} param
 */
export const cancel = async (param) => {
    await models.product.update({
        del: 2
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '作废成功' };
};
/**
 * 终止
 * @param {*} param
 */
export const stop = async (param) => {
    await models.product.update({
        del: 3,
        approval_reason: param.approval_reason
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '终止成功' };
};
/**
 * 立项
 */
export const stand = async (param) => {
    console.log('=========立项============', param);
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    try {
        // 跟新主表
        await models.product.update({
            project_leader: param.project_leader,
            plan_manage_id: param.plan_manage_id,
            approval_end_time: param.approval_end_time ? parseInt(param.approval_end_time / 1000) : 0,
            status: 2,
            approval_time: time
        }, {
            where: {
                id: param.id
            },
            transaction
        });
        // 更新里程碑，立项时间
        await models.product_schedule.update({
            project_approval_time: time
        }, {
            where: {
                product_id: param.id
            },
            transaction
        }); // 增加文件文件
        if (param.addFiels && param.addFiels.length) {
            const fiels = [];
            param.addFiels.forEach(item => {
                fiels.push({
                    product_id: param.id,
                    type: item.type,
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    create_time: time
                });
            });
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '立项成功' };
    } catch (error) {
        console.log('立项错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '立项错误' };
    }
};
/**
 * 产品评估
 * @param {*} param
 */
export const assessment = async (param) => {
    console.log('=============产品评估=============', param);
    let checkResult = assessmentCheck(param);
    if (checkResult.code != RESULT_SUCCESS) {
        return checkResult;
    }
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    let status = 3;

    // 评估状态是否通过，1通过。2不通过
    if (param.project_status) {
        if (param.project_status == 1) {
            status = 3;
        } else {
            status = 1;
        }
    } else {
        return { code: RESULT_ERROR, msg: '产品评估失败，参数错误' };
    }
    try {
        // 更新主表
        await models.product.update({
            status,
            approval_reason: param.approval_reason
        }, {
            where: {
                id: param.id
            }, transaction
        });
        // 更新附属表
        await models.product_schedule.update({
            suction_degree: param.suction_degree || undefined,
            secondary_stay: param.secondary_stay || undefined,
            game_duration: param.game_duration || undefined,
            cycle_requirements: param.cycle_requirements || undefined,
            quality_requirement: param.quality_requirement || undefined,
            feel_requirements: param.feel_requirements || undefined,
            estimate_program_person: param.estimate_program_person || undefined,
            estimate_program_day: param.estimate_program_day || undefined,
            estimate_art_person: param.estimate_art_person || undefined,
            estimate_art_day: param.estimate_art_day || undefined,
            estimate_plan_person: param.estimate_plan_person || undefined,
            estimate_plan_day: param.estimate_plan_day || undefined,
            contend_message: JSON.stringify(param.contend_message),
            procedure_evaluation: JSON.stringify(param.procedure_evaluation),
            art_evaluation: JSON.stringify(param.art_evaluation),
            operational_evaluation: JSON.stringify(param.operational_evaluation),
            plan_evaluation: JSON.stringify(param.plan_evaluation),
            soft_writing_day: param.soft_writing_day || undefined,
            game_version_day: param.game_version_day || undefined,
            wide_electric_approval: param.wide_electric_approval || undefined,
        }, {
            where: {
                product_id: param.id,
            },
            transaction
        });
        // 删除文件
        if (param.delFiles && param.delFiles.length) {
            const urls = [];
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
        if (param.addFiels && param.addFiels.length) {
            const fiels = [];
            param.addFiels.forEach(item => {
                fiels.push({
                    product_id: param.id,
                    type: item.type,
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    create_time: time
                });
            });
            await models.file.bulkCreate(fiels, transaction);
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '产品评估成功' };
    } catch (error) {
        console.log('产品评估错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '产品评估错误' };
    }
};
/**
 * 恢复产品到初始状态
 */
export const recovery = async (param) => {
    const transaction = await models.sequelize.transaction();
    const functs = [];
    try {
        // 更新主表
        functs.push(models.product.update({
            status: 1,
            del: 1,
            approval_reason: param.approval_reason,
            approval_end_time: 0,
            APPID: '',
            APPKEY: '',
            initialization: 1

        }, {
            where: {
                id: param.id
            },
            transaction
        }));
        // 更新附表数据
        functs.push(models.product_schedule.update({
            suction_degree: 0,
            secondary_stay: 0,
            game_duration: 0,
            cycle_requirements: '',
            quality_requirement: '',
            feel_requirements: '',
            estimate_program_person: 0,
            estimate_program_day: 0,
            estimate_art_person: 0,
            estimate_art_day: 0,
            estimate_plan_person: 0,
            estimate_plan_day: 0,
            soft_writing_day: 0,
            game_version_day: 0,
            wide_electric_approval: 0,
            project_approval_time: 0,
            file_complete_time: 0,
            strat_up_time: 0,
            program_intervention_time: 0,
            program_end_time: 0,
            art_intervention_time: 0,
            art_end_time: 0,
            core_functions_time: 0,
            demo_time: 0,
            experience_time: 0,
            transfer_operation_time: 0,
            extension_time: 0,
            actual_demo_time: 0,
            actual_experience_time: 0,
            actual_transfer_operation: 0,
            actual_extension_time: 0,
            contend_message: '',
            procedure_evaluation: '',
            art_evaluation: '',
            operational_evaluation: '',
            plan_evaluation: '',
        }, {
            where: {
                product_id: param.id
            },
            transaction
        }));
        functs.push(models.file.destroy({
            where: {
                type: { $gte: 6 },
                product_id: param.id
            },
            transaction
        }));
        // 查询需要删除的文件
        let files = await models.file.findAll({
            where: {
                type: { $gte: 6 },
                product_id: param.id
            }
        });
        if (files.length) {
            files.forEach(item => {
                delFile(item.url);
            });
        }
        await Promise.all(functs);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '恢复产品成功' };
    } catch (error) {
        console.log('恢复产品错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '恢复产品错误' };
    }
};
/**
 * 还原,产品恢复到终止前状态
 */
export const reduction = async (param) => {
    await models.product.update({
        del: 1,
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: '还原成功' };
};
/**
 * 产品池查询产品列表
 * @param {*} param
 */
export const findAll = async (param, token, headerTOken) => {
    console.log('=========产品池查询产品列表============', param);
    param.pageSize = Number(param.pageSize);
    param.page = Number(param.page);
    if (param.create_time && param.create_time.length > 1) {
        param.create_time[0] = parseInt(param.create_time[0] / 1000);
        param.create_time[1] = parseInt(param.create_time[1] / 1000);
    }

    let sql = ` select *,t1.id as id,t1.status as status, t1.create_time*1000 as create_time,t1.update_time*1000 as update_time,t1.approval_time*1000 as approval_time,t1.approval_end_time*1000 as approval_end_time,t1.id as product_id,t3.url as icon
     from product t1 left join product_base t2 on t1.id=t2.product_id LEFT JOIN file t3 ON t3.product_id=t1.id AND t3.type=1 `;
    let sqlAll = ' select count(1) as num from product t1 left join product_base t2 on t1.id=t2.product_id ';
    let object = {
        'game_type$=': param.game_type,
        'pool_id$=': param.pool_id,
        'plan_manage_id$=': param.plan_manage_id,
        'provide_id$=': param.provide_id,
        'create_time$b': param.create_time,
        'product_name$l': param.product_name
    },
        sqlMap = {
            del: 't1.del',
            game_type: 't2.game_type',
            pool_id: 't2.pool_id',
            plan_manage_id: 't1.plan_manage_id',
            provide_id: 't1.provide_id',
            create_time: 't1.create_time',
            status: 't1.status',
            technology_type: 't2.technology_type',
            product_name: 't1.product_name'
        };

    // 产品状态搜索条件
    param.status = Number(param.status);
    switch (param.status) {
        case 1:
            object['del$='] = 1;
            object['status$='] = 1;
            break;
        case 2:
            object['del$='] = 1;
            object['status$='] = 2;
            break;
        case 3:
            object['del$='] = 2;

            break;
        case 4:
            object['del$='] = 3;

            break;
        default:
            object['del$='] = 1;
            object.status$i = [1, 2];
            break;
    }


    // 技术选型搜索条件
    if (param.technology_type) {
        param.technology_type = Number(param.technology_type);
        switch (param.technology_type) {
            case 1:
                object.technology_type$i = [1, 2];
                break;
            case 2:
                object.technology_type$i = [3, 4];
                break;
            case 3:
                object.technology_type$i = [2, 4];
                break;
            case 4:
                object.technology_type$i = [1, 2];
                break;
            case 5:
                object['technology_type$='] = 1;
                break;
            case 6:
                object['technology_type$='] = 2;
                break;
            case 7:
                object['technology_type$='] = 3;
                break;
            case 8:
                object['technology_type$='] = 4;
                break;
        }
    }
    const sqlResult = sqlAppent(object, sqlMap, sql);

    console.log('---------', sqlResult);
    sql += sqlResult.sql;
    sqlAll += sqlResult.sql;
    // 是否能够拥有查询全部产品权限
    let isPermissionResult = await isPermission(headerTOken, '/product/productAll');
    if (isPermissionResult.code != 1000) {
        return isPermissionResult;
    }
    if (isPermissionResult.data.isPermission != 1) {
        sql += ` and ( t1.input_user_id=${token.uid} OR t1.provide_id=${token.uid} OR t1.plan_manage_id=${token.uid} OR t1.project_leader=${token.uid} OR t1.main_course=${token.uid} OR t1.master_beauty=${token.uid} OR t1.project_approval_id=${token.uid} ) `;
        sqlAll += ` and ( t1.input_user_id=${token.uid} OR t1.provide_id=${token.uid} OR t1.plan_manage_id=${token.uid} OR t1.project_leader=${token.uid} OR t1.main_course=${token.uid} OR t1.master_beauty=${token.uid} OR t1.project_approval_id=${token.uid} ) `;
    }
    sql += ' group by t1.id order by t1.create_time desc ';
    sql += sqlLimit(param.page, param.pageSize);
    const results = await Promise.all([models.sequelize.query(sql, { replacements: sqlResult.param, type: models.SELECT }), models.sequelize.query(sqlAll, { replacements: sqlResult.param, type: models.SELECT })]);
    return { code: RESULT_SUCCESS, data: results[0], total: results[1][0].num };
};
/**
 * 查询产品详情
 * @param {*} param
 */
export const findDetail = async (param) => {
    const sql = ` select * ,t1.create_time*1000 as create_time,t1.update_time*1000 as update_time,t1.approval_time*1000 as approval_time,t1.approval_end_time*1000 as approval_end_time
    from product t1 left join product_base t2 on t1.id=t2.product_id left join product_schedule t3 on t1.id=t3.product_id  where t1.id=? `;
    const result = await models.sequelize.query(sql, { replacements: [param.id], type: models.SELECT });
    const files = await models.file.findAll({ where: { product_id: param.id } });
    let data = {};
    if (result && result.length) {
        data = result[0];
        if (data.contend_message && data.contend_message.length) {
            data.contend_message = JSON.parse(data.contend_message);
        }
        if (data.art_evaluation && data.art_evaluation.length) {
            data.art_evaluation = JSON.parse(data.art_evaluation);
        }
        if (data.procedure_evaluation && data.procedure_evaluation.length) {
            data.procedure_evaluation = JSON.parse(data.procedure_evaluation);
        }
        if (data.operational_evaluation && data.operational_evaluation.length) {
            data.operational_evaluation = JSON.parse(data.operational_evaluation);
        }
        if (data.plan_evaluation && data.plan_evaluation.length) {
            data.plan_evaluation = JSON.parse(data.plan_evaluation);
        }

    }
    data.files = files;
    return { code: RESULT_SUCCESS, data };
};
/**
 * 查询项目列表
 */
export const findProject = async () => {
    try {
        const projects = await models.product.findAll({
            attributes: ['id', 'product_name']
        });
        return { code: RESULT_SUCCESS, msg: '成功', data: projects };
    } catch (error) {
        console.log('error:', error);
    }
};

/**
 * 投入制作
 */
export const putIntoProduction = async (param) => {
    await models.product.update({
        status: 3
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS };
};


/**
 * 产品评估参数效验
 * @param {Object} param 参数
 */
function assessmentCheck(param) {
    if (!param.suction_degree || isNaN(param.suction_degree)) {
        return { code: RESULT_ERROR, msg: '请正确填写题材吸量程度' };
    }
    if (!param.secondary_stay || isNaN(param.secondary_stay)) {
        return { code: RESULT_ERROR, msg: '请正确填写预估新用户次留' };
    }
    if (!param.game_duration || isNaN(param.game_duration)) {
        return { code: RESULT_ERROR, msg: '请正确填写预估游戏时长' };
    }

    if (!param.estimate_program_person || isNaN(param.estimate_program_person)) {
        return { code: RESULT_ERROR, msg: '请正确填写程序人数' };
    }
    if (!param.estimate_program_day || isNaN(param.estimate_program_day)) {
        return { code: RESULT_ERROR, msg: '请正确填写程序天数' };
    }
    if (!param.estimate_art_person || isNaN(param.estimate_art_person)) {
        return { code: RESULT_ERROR, msg: '请正确填写美术人数' };
    }
    if (!param.estimate_art_day || isNaN(param.estimate_art_day)) {
        return { code: RESULT_ERROR, msg: '请正确填写美术天数' };
    }
    if (!param.estimate_plan_person || isNaN(param.estimate_plan_person)) {
        return { code: RESULT_ERROR, msg: '请正确填写策划天数' };
    }
    if (!param.estimate_plan_day || isNaN(param.estimate_plan_day)) {
        return { code: RESULT_ERROR, msg: '请正确填写策划人数' };
    }

    if (!param.soft_writing_day || isNaN(param.soft_writing_day)) {
        return { code: RESULT_ERROR, msg: '请正确填写软件著作权申请（天）' };
    }
    if (!param.game_version_day || isNaN(param.game_version_day)) {
        return { code: RESULT_ERROR, msg: '请正确填写游戏版号申请（天）' };
    }
    if (!param.wide_electric_approval || isNaN(param.wide_electric_approval)) {
        return { code: RESULT_ERROR, msg: '请正确填写广电批文（天）' };
    }



    return { code: RESULT_SUCCESS };
}