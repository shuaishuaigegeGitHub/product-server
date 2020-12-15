import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const task_subset = sequelize.define('task_subset', {

        id: {
            type: Sequelize.INTEGER,
            comment: '任务id',
            primaryKey: true,
            autoIncrement: true,
        },

        task_id: {
            type: Sequelize.INTEGER,
            comment: '任务id',


        },

        message: {
            type: Sequelize.STRING(2550),
            comment: '任务内容',


        },

        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1 未完成，2 已完成',


        },


    }, {
        underscored: true,
        tableName: 'task_subset',
        createdAt: 'create_time',
        timestamps: false,

    });
    return task_subset;
};