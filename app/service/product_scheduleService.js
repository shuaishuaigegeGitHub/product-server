import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param) => {
    await models.product_schedule.create({

        id: param.id,

        product_id: param.product_id,

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

        selection_time: param.selection_time,

        project_approval_time: param.project_approval_time,

        file_complete_time: param.file_complete_time,

        strat_up_time: param.strat_up_time,

        program_intervention_time: param.program_intervention_time,

        program_end_time: param.program_end_time,

        art_intervention_time: param.art_intervention_time,

        art_end_time: param.art_end_time,

        core_functions_time: param.core_functions_time,

        demo_time: param.demo_time,

        experience_time: param.experience_time,

        transfer_operation_time: param.transfer_operation_time,

        extension_time: param.extension_time,

        actual_demo_time: param.actual_demo_time,

        actual_experience_time: param.actual_experience_time,

        actual_transfer_operation: param.actual_transfer_operation,

        actual_extension_time: param.actual_extension_time,

        contend_message: param.contend_message,

        procedure_evaluation: param.procedure_evaluation,

        art_evaluation: param.art_evaluation,

        operational_evaluation: param.operational_evaluation,

    });
    return { code: RESULT_SUCCESS, msg: "添加成功" };
};

//更新
export const update = async (param) => {
    await models.product_schedule.update({

        id: param.id,

        product_id: param.product_id,

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

        selection_time: param.selection_time,

        project_approval_time: param.project_approval_time,

        file_complete_time: param.file_complete_time,

        strat_up_time: param.strat_up_time,

        program_intervention_time: param.program_intervention_time,

        program_end_time: param.program_end_time,

        art_intervention_time: param.art_intervention_time,

        art_end_time: param.art_end_time,

        core_functions_time: param.core_functions_time,

        demo_time: param.demo_time,

        experience_time: param.experience_time,

        transfer_operation_time: param.transfer_operation_time,

        extension_time: param.extension_time,

        actual_demo_time: param.actual_demo_time,

        actual_experience_time: param.actual_experience_time,

        actual_transfer_operation: param.actual_transfer_operation,

        actual_extension_time: param.actual_extension_time,

        contend_message: param.contend_message,

        procedure_evaluation: param.procedure_evaluation,

        art_evaluation: param.art_evaluation,

        operational_evaluation: param.operational_evaluation,

    }, {
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "修改成功" };
};
//删除
export const del = async (param) => {
    await models.product_schedule.destroy({
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
    const { count, rows } = await models.product_schedule.findAndCountAll({
        limit: param.pagesize,
        offset: (param.page - 1) * param.pagesize,
        where: {

        },
    });
    return { code: RESULT_SUCCESS, count, rows };
};