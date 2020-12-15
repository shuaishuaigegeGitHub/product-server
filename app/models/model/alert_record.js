import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const alert_record = sequelize.define('alert_record', {

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

        task_id: {
            type: Sequelize.INTEGER,
            comment: '任务id.',


        },

        type: {
            type: Sequelize.INTEGER,
            comment: '类型：1、里程。2任务',


        },

        message: {
            type: Sequelize.TEXT,
            comment: '修改信息',


        },

        user_id: {
            type: Sequelize.INTEGER,
            comment: '修改人id',


        },

        reason: {
            type: Sequelize.STRING(255),
            comment: '修改的理由',


        },
        create_time: {
            type: Sequelize.INTEGER,
            comment: '修改时间',


        },

    }, {
        underscored: true,
        tableName: 'alert_record',
        createdAt: 'create_time',
        updatedAt: 'update_time',
        timestamps: false,
        hooks: {
            beforeCreate: (instance) => {
                instance.create_time = dayjs().unix();
            },
            beforeUpdate: (instance) => {
                instance.update_time = dayjs().unix();
            }
        }
    });
    return alert_record;
};