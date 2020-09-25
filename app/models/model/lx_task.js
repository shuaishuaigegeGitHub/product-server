import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let lx_task = sequelize.define('lx_task', {

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
            comment: '任务创建人ID',


        },

        task_username: {
            type: Sequelize.STRING(50),
            comment: '任务创建人名字',


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
            type: Sequelize.STRING(30),
            comment: '任务开始时间',


        },

        end_time: {
            type: Sequelize.STRING(30),
            comment: '任务结束时间',


        },

        state: {
            type: Sequelize.TINYINT(4),
            comment: '完成状态：1,未开始 。 2、进行中。3、已完成。4、已延期。5、顺延中',
        },

        create_time: {
            type: Sequelize.STRING(30),
            comment: '创建时间',


        },

        update_time: {
            type: Sequelize.STRING(30),
            comment: '最后修改时间',


        },

        check: {
            type: Sequelize.INTEGER,
            comment: '验收状态：1未验收，2验收失败，3验收通过',


        },

        check_remark: {
            type: Sequelize.STRING(255),
            comment: '验收备注',


        },

        acceptor_time: {
            type: Sequelize.STRING(30),
            comment: '验收时间',


        },

        reality_start_time: {
            type: Sequelize.STRING(30),
            comment: '实际开始时间',


        },

        reality_end_time: {
            type: Sequelize.STRING(30),
            comment: '实际结束时间',


        },

    }, {
        underscored: true,
        tableName: 'lx_task',
        timestamps: false,
    });
    return lx_task;
};