import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let task = sequelize.define('task', {

        id: {
            type: Sequelize.BIGINT(20),
            comment: '任务ID',
            primaryKey: true,
            autoIncrement: true,
        },

        project_id: {
            type: Sequelize.INTEGER,
            comment: '项目ID',


        },
        task_type: {
            type: Sequelize.INTEGER,
            comment: '任务类型',


        },
        module_id: {
            type: Sequelize.INTEGER,
            comment: '所属任务模块',


        },

        task_name: {
            type: Sequelize.STRING(100),
            comment: '任务名称',


        },

        priority: {
            type: Sequelize.TINYINT(4),
            comment: '优先级',


        },

        task_detail: {
            type: Sequelize.TEXT,
            comment: '任务描述',


        },

        task_user_id: {
            type: Sequelize.INTEGER,
            comment: '任务执行者ID',


        },

        task_username: {
            type: Sequelize.STRING(50),
            comment: '任务执行者名字',


        },

        acceptor_id: {
            type: Sequelize.INTEGER,
            comment: '任务验收者ID',


        },

        acceptor_username: {
            type: Sequelize.STRING(50),
            comment: '任务验收者名字',


        },

        begin_time: {
            type: Sequelize.INTEGER,
            comment: '任务开始时间',


        },

        end_time: {
            type: Sequelize.INTEGER,
            comment: '任务结束时间',


        },

        state: {
            type: Sequelize.TINYINT(4),
            comment: '任务状态。-1：验收失败，0：未开始，1：进行中，2：已完成，3：验收成功，4：已关闭，9：已删除',


        },

        create_by: {
            type: Sequelize.STRING(50),
            comment: '任务创建者',


        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',


        },

        update_time: {
            type: Sequelize.INTEGER,
            comment: '最后修改时间',


        },

    }, {
        underscored: true,
        tableName: 'task',
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
    return task;
};