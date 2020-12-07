import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let product_check = sequelize.define('product_check', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',


        },

        version_number: {
            type: Sequelize.STRING(255),
            comment: '版本号',


        },

        type: {
            type: Sequelize.INTEGER,
            comment: '验收类型：1Demo版，2体验版',


        },

        meeting_theme: {
            type: Sequelize.STRING(255),
            comment: '会议主题',


        },

        meeting_address: {
            type: Sequelize.STRING(255),
            comment: '会议地点',


        },

        meeting_date: {
            type: Sequelize.INTEGER,
            comment: '会议日期',


        },

        meeting_time: {
            type: Sequelize.STRING(255),
            comment: '会议时间',


        },

        sponsor: {
            type: Sequelize.INTEGER,
            comment: '发起人id',


        },

        host: {
            type: Sequelize.INTEGER,
            comment: '主持人id',


        },

        participants: {
            type: Sequelize.STRING(255),
            comment: '参与人们id，逗号隔开',


        },

        record: {
            type: Sequelize.INTEGER,
            comment: '记录人id',


        },

        result: {
            type: Sequelize.INTEGER,
            comment: '评估结果：1通过，2不通过',


        },

        creade_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',


        },
    }, {
        underscored: true,
        tableName: 'product_check',
        createdAt: 'create_time',
        updatedAt: 'update_time',
        timestamps: false,
        hooks: {
            beforeCreate: (instance, options) => {
                instance.create_time = dayjs().unix();
            },
            beforeUpdate: (instance, options) => {
                instance.update_time = dayjs().unix();
            }
        }
    });
    return product_check;
};