import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let task_log = sequelize.define('task_log', {

        id: {
            type: Sequelize.BIGINT(20),
            comment: 'ID',
            primaryKey: true,
            autoIncrement: true,
        },

        task_id: {
            type: Sequelize.BIGINT(20),
            comment: '任务ID',


        },

        operator: {
            type: Sequelize.STRING(50),
            comment: '操作者',


        },

        column_name: {
            type: Sequelize.STRING(50),
            comment: '列名',


        },

        content: {
            type: Sequelize.TEXT,
            comment: '内容',


        },

        detail: {
            type: Sequelize.STRING(255),
            comment: '操作描述',


        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',


        },

        update_time: {
            type: Sequelize.INTEGER,
            comment: '最后更新时间',


        },

    }, {
        underscored: true,
        tableName: 'task_log',
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
    return task_log;
};