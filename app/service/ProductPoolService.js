// 产品池
import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";
import { delFile } from "../util/localOperationFile";



/**
 * 产品池添加项目保存
 * @param {*} param 
 * @param {*} token 
 */
export const add = async (param, token) => {
    let time = dayjs() / 1000;
    let transaction = await models.sequelize.transaction();
    try {
        // 保存产品主表
        let result = await models.product.create({

            create_time: time,

            product_name: param.product_name,

            status: 1,

            del: 1,

            provide_id: param.provide_id,

            input_user_id: token.uid,

        }, transaction);
        result = result.get();
        // 保存基本数据
        await models.product_base.create({


            product_id: result.id,

            priority: param.priority,

            project_type: param.project_type,

            technology_type: param.technology_type,

            game_type: param.game_type,

            theme: param.theme,

            play_theme: param.play_theme,

            starting: param.starting,

            source: param.source,

            poll: param.poll,

            pool_id: param.pool_id,

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

        }, transaction);
        // 保存附表文件，保存选品通过时间
        await models.product_schedule.create({
            product_id: result.id,
            selection_time: time
        }, transaction);
        // 保存文件
        if (param.files && param.files.length) {
            let fiels = [];
            param.files.forEach(item => {
                fiels.push({
                    product_id: result.id,
                    type: item.type,
                    name: item.name,
                    path: item.path,
                    size: item.size,
                    create_time: time
                });
            });
            await models.file.bulkCreate(fiels, transaction);
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "添加成功" };
    } catch (error) {
        console.log("产品池添加项目保存错误：", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "添加失败" };
    }

};


/**
 * 产品池更新项目
 * @param {*} param 
 * @param {*} token 
 */
export const update = async (param, token) => {
    let time = dayjs() / 1000;
    let transaction = await models.sequelize.transaction();
    try {
        // 更新产品主表
        let result = await models.product.update({

            update_time: time,

            product_name: param.product_name,

            status: 1,

            del: 1,

            provide_id: param.provide_id,

            input_user_id: token.uid,

        }, {
            where: {
                id: param.id
            },
            transaction
        });
        result = result.get();
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

            pool_id: param.pool_id,

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
            let ids = [];
            param.delFIles.forEach(item => {
                delFile(item.path);
                ids.path(item.id);
            });
            await models.file.destroy({
                where: {
                    id: { $in: ids }
                },
                transaction
            });
        }
        // 增加文件文件
        if (param.addFiels && param.addFiels.length) {
            let fiels = [];
            param.addFiels.forEach(item => {
                fiels.push({
                    product_id: result.id,
                    type: item.type,
                    name: item.name,
                    path: item.path,
                    size: item.size,
                    create_time: time
                });
            });
            await models.file.bulkCreate(fiels, transaction);
        }

        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "修改成功" };
    } catch (error) {
        console.log("产品池更新项目更新错误：", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "更新错误" };
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
    return { code: RESULT_SUCCESS, msg: "作废成功" };
};
/**
 * 终止
 * @param {*} param 
 */
export const stop = async (param) => {
    await models.product.update({
        del: 3
    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "终止成功" };
};
/**
 * 立项
 */
export const stand = async (param) => {
    let time = dayjs() / 1000;
    let transaction = await models.sequelize.transaction();
    try {
        // 跟新主表
        await models.product.update({
            project_leader: param.project_leader,
            plan_manage_id: param.plan_manage_id,
            approval_end_time: param.approval_end_time,
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
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "立项成功" };
    } catch (error) {
        console.log("立项错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "立项错误" };
    }
};
/**
 * 产品评估
 * @param {*} param 
 */
export const assessment = async (param) => {
    let time = dayjs() / 1000;
    let transaction = await models.sequelize.transaction();
    let status = 3;

    // 评估状态是否通过，1通过。2不通过
    if (param.project_status) {
        if (param.project_status == 1) {
            status = 3;
        } else {
            status = 1;
        }

    } else {
        return { code: RESULT_ERROR, msg: "产品评估失败，参数错误" };
    }
    try {
        // 更新主表
        await models.product.update({
            status: status,
            approval_reason: param.approval_reason
        }, {
            where: {
                id: param.id
            }
        });
        // 更新附属表
        await models.product_schedule.update({
            suction_degree: param.suction_degree,
            secondary_stay: param.secondary_stay,
            game_duration: param.game_duration,
            cycle_requirements: param.cycle_requirements,
            quality_requirement: param.quality_requirement,
            feel_requirements: param.feel_requirements,
            estimate_program_person: param.estimate_program_person,
            estimate_program_day: param.estimate_program_day,
            estimate_art_person: param.estimate_art_person,
            estimate_art_day: param.estimate_art_day,
            estimate_plan_person: param.estimate_plan_person,
            estimate_plan_day: param.estimate_plan_day,
            soft_writing_day: param.soft_writing_day,
            game_version_day: param.game_version_day,
            wide_electric_approval: param.wide_electric_approval,
            strat_up_time: status == 3 ? time : undefined,
            contend_message: JSON.stringify(param.contend_message),
            procedure_evaluation: JSON.stringify(param.procedure_evaluation),
            art_evaluation: JSON.stringify(param.art_evaluation),
            operational_evaluation: JSON.stringify(param.operational_evaluation),
        }, {
            where: {
                product_id: param.id,
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "产品评估成功" };
    } catch (error) {
        console.log("产品评估错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "产品评估错误" };
    }
};
/**
 * 恢复产品到初始状态
 */
export const recovery = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {


        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "恢复产品成功" };
    } catch (error) {
        console.log("恢复产品错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "恢复产品错误" };
    }
};