import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let product = sequelize.define('product', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',


        },

        update_time: {
            type: Sequelize.INTEGER,
            comment: '更新时间',


        },

        product_name: {
            type: Sequelize.STRING(255),
            comment: '产品名称',


        },

        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1 未立项。2 已立项。3 研发中。 4 demo版。 5 体验版。 6 移交运营',


        },

        del: {
            type: Sequelize.INTEGER,
            comment: '是否作废：1、正常。2已作废。3已终止',


        },

        provide_id: {
            type: Sequelize.INTEGER,
            comment: '提供者id',


        },

        input_user_id: {
            type: Sequelize.INTEGER,
            comment: '录入者id',


        },

        plan_manage_id: {
            type: Sequelize.INTEGER,
            comment: '策划负责人id',


        },

        project_leader: {
            type: Sequelize.INTEGER,
            comment: '项目负责人',


        },

        main_course: {
            type: Sequelize.INTEGER,
            comment: '主程id',


        },

        master_beauty: {
            type: Sequelize.INTEGER,
            comment: '主美id',


        },

        project_approval_id: {
            type: Sequelize.INTEGER,
            comment: '立项人id',


        },

        approval_time: {
            type: Sequelize.INTEGER,
            comment: '立项时间',


        },

        approval_reason: {
            type: Sequelize.STRING(255),
            comment: '立项理由',


        },

        approval_end_time: {
            type: Sequelize.INTEGER,
            comment: '立项截止时间',


        },

        APPID: {
            type: Sequelize.STRING(255),
            comment: '钉钉appid',


        },

        APPKEY: {
            type: Sequelize.STRING(255),
            comment: '钉钉appkey',


        },

        webhook: {
            type: Sequelize.STRING(255),
            comment: '钉钉消息通知机器人webhook',


        },
        keyword: {
            type: Sequelize.STRING(255),
            comment: '钉钉消息通知关键词',


        },

        initialization: {
            type: Sequelize.INTEGER,
            comment: '研发初始化，1未初始化。2已初始化',


        },

        fixed_file: {
            type: Sequelize.INTEGER,
            comment: '里程碑是否定档，1未定档，2已定档',


        },

    }, {
        underscored: true,
        tableName: 'product',
        timestamps: false,

    });
    return product;
};