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
        commit: {
            type: Sequelize.INTEGER,
            comment: '验收状态',


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
            type: Sequelize.BIGINT(15),
            comment: '最后修改时间',


        },
        check: {
            type: Sequelize.INTEGER,
            comment: '验收状态',


        },
        check_remark: {
            type: Sequelize.STRING(255),
            comment: '验收备注',


        },
        acceptor_time: {
            type: Sequelize.INTEGER,
            comment: '验收时间',


        },
        predict_start_time: {
            type: Sequelize.INTEGER,
            comment: '预估开始时间',


        },
        predict_end_time: {
            type: Sequelize.INTEGER,
            comment: '预估结束时间',


        },
        reality_start_time: {
            type: Sequelize.INTEGER,
            comment: '实际开始时间',


        },
        reality_end_time: {
            type: Sequelize.INTEGER,
            comment: '实际结束时间',
        },
        manage_id: {
            type: Sequelize.INTEGER,
            comment: '负责人id',
        },
        manage_name: {
            type: Sequelize.STRING(50),
            comment: '负责人名称',
        },

    }, {
        underscored: true,
        tableName: 'task',
        createdAt: 'create_time',
        updatedAt: 'update_time',
        timestamps: false,
        hooks: {
        }
    });
    return task;
};