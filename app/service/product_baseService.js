import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param) => {
    await models.product_base.create({

        id: param.id,

        product_id: param.product_id,

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

    });
    return { code: RESULT_SUCCESS, msg: "添加成功" };
};

//更新
export const update = async (param) => {
    await models.product_base.update({

        id: param.id,

        product_id: param.product_id,

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
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "修改成功" };
};
//删除
export const del = async (param) => {
    await models.product_base.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除成功" };
};

//查询
export const findAll = async (param) => {
    param.pagesize = Number(param.pagesize);
    param.page = Number(param.page);
    const { count, rows } = await models.product_base.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where: {

        },
    });
    return { code: RESULT_SUCCESS, count, rows };
};