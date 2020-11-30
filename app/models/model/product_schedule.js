import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let product_schedule = sequelize.define('product_schedule', {

        schedule_id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',


        },

        suction_degree: {
            type: Sequelize.DOUBLE(11, 2),
            comment: '评估-市场调研。题材吸量程度%',


        },

        secondary_stay: {
            type: Sequelize.DOUBLE(11, 2),
            comment: '评估-市场调研。预估新用户次留%',


        },

        game_duration: {
            type: Sequelize.INTEGER,
            comment: '评估-市场调研。预估游戏时长（S）',


        },

        cycle_requirements: {
            type: Sequelize.STRING(255),
            comment: '评估-市场调研。项目研发周期要求',


        },

        quality_requirement: {
            type: Sequelize.STRING(255),
            comment: '评估-市场调研。项目画面品质要求',


        },

        feel_requirements: {
            type: Sequelize.STRING(255),
            comment: '评估-市场调研。项目操作手感要求',


        },

        estimate_program_person: {
            type: Sequelize.INTEGER,
            comment: '预估投入，程序人数',


        },

        estimate_program_day: {
            type: Sequelize.INTEGER,
            comment: '预估投入，程序天数',


        },

        estimate_art_person: {
            type: Sequelize.INTEGER,
            comment: '预估投入，美术人数',


        },

        estimate_art_day: {
            type: Sequelize.INTEGER,
            comment: '预估投入，美术天数',


        },

        estimate_plan_person: {
            type: Sequelize.INTEGER,
            comment: '预估投入，策划天数',


        },

        estimate_plan_day: {
            type: Sequelize.INTEGER,
            comment: '预估投入，策划人数',


        },

        soft_writing_day: {
            type: Sequelize.INTEGER,
            comment: '软件著作权申请（天）',


        },

        game_version_day: {
            type: Sequelize.INTEGER,
            comment: '游戏版号申请（天）',


        },

        wide_electric_approval: {
            type: Sequelize.INTEGER,
            comment: '广电批文（天）',


        },

        selection_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑，选品通过日期',


        },

        project_approval_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑，立项日期',


        },

        file_complete_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑，文档完成日期',


        },

        strat_up_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,启动日期',


        },

        program_intervention_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,程序介入日期',


        },

        program_end_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,程序完成日期',


        },

        art_intervention_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,美术介入日期',


        },

        art_end_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,美术完成日期',


        },

        core_functions_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,核心功能版日期',


        },

        demo_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,demo版日期',


        },

        experience_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,体验版日期',


        },

        transfer_operation_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,移交运营日期',


        },

        extension_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,上线推广日期',


        },

        actual_demo_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,实际demo版日期',


        },

        actual_experience_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,实际体验版日期',


        },

        actual_transfer_operation: {
            type: Sequelize.INTEGER,
            comment: '里程碑,实际移交运营日期',


        },

        actual_extension_time: {
            type: Sequelize.INTEGER,
            comment: '里程碑,实际正式上线时间',


        },

        contend_message: {
            type: Sequelize.TEXT,
            comment: '竞品信息json：[{ name:竞品名称,channel:上架渠道,performance:市场表现}]',


        },

        procedure_evaluation: {
            type: Sequelize.TEXT,
            comment: '程序评估信息json：[{spot：评估点，explain：说明，result：评估结果：1 通过。2 未通过}]',


        },

        art_evaluation: {
            type: Sequelize.TEXT,
            comment: '美术评估信息json：[{spot：评估点，explain：说明，result：评估结果：1 通过。2 未通过}]',


        },

        operational_evaluation: {
            type: Sequelize.TEXT,
            comment: '运营评估信息json：[{spot：评估点，explain：说明，result：评估结果：1 通过。2 未通过}]',


        },

    }, {
        underscored: true,
        tableName: 'product_schedule',
        timestamps: false,
    });
    return product_schedule;
};