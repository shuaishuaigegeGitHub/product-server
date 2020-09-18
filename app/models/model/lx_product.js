import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let lx_product = sequelize.define('lx_product', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        manage_id: {
            type: Sequelize.INTEGER,
            comment: '负责人id',


        },

        manage_name: {
            type: Sequelize.STRING(255),
            comment: '负责人名称',


        },

        plan_manage_id: {
            type: Sequelize.INTEGER,
            comment: '策划负责人id',


        },

        plan_manage_name: {
            type: Sequelize.STRING(255),
            comment: '策划负责人名称',


        },
        create_time: {
            type: Sequelize.STRING(30),
            comment: '创建时间',


        },

        update_time: {
            type: Sequelize.STRING(30),
            comment: '更新时间',


        },

        month: {
            type: Sequelize.STRING(20),
            comment: '存储年月，按月份查询时使用',


        },

        del: {
            type: Sequelize.INTEGER,
            comment: '是否作废：1、未作废。2已作废',


        },

        game_start: {
            type: Sequelize.STRING(255),
            comment: '项目开始时间',


        },

        game_end: {
            type: Sequelize.STRING(255),
            comment: '项目结束时间',


        },

        status: {
            type: Sequelize.INTEGER,
            comment: '状态',


        },

        product_name: {
            type: Sequelize.STRING(255),
            comment: '游戏名称',


        },

        product_pool_id: {
            type: Sequelize.INTEGER,
            comment: '产品池项目id',


        },
        priority: {
            type: Sequelize.INTEGER,
            comment: '优先级',


        },

    }, {
        underscored: true,
        tableName: 'lx_product',
        timestamps: false,
    });
    return lx_product;
};