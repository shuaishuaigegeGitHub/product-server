import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const task_person = sequelize.define('task_person', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        task_id: {
            type: Sequelize.INTEGER,
            comment: '任务id',


        },
        user_id: {
            type: Sequelize.INTEGER,
            comment: '执行人id',


        },


    }, {
        underscored: true,
        tableName: 'task_person',
        timestamps: false,
    });
    return task_person;
};