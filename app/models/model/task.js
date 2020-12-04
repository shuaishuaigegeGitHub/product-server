import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let task = sequelize.define('task', {

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

        group_id: {
            type: Sequelize.INTEGER,
            comment: '分组id',


        },

        priority: {
            type: Sequelize.INTEGER,
            comment: '优先级',


        },

        label: {
            type: Sequelize.STRING(100),
            comment: '任务标签',


        },
        title: {
            type: Sequelize.STRING(255),
            comment: '任务标题',


        },
        describe: {
            type: Sequelize.STRING(255),
            comment: '任务描述',


        },
        start_time: {
            type: Sequelize.INTEGER,
            comment: '任务开始时间',


        },
        end_time: {
            type: Sequelize.INTEGER,
            comment: '任务结束时间',


        },
        real_create_time: {
            type: Sequelize.INTEGER,
            comment: '实际开始时间',


        },
        real_end_time: {
            type: Sequelize.INTEGER,
            comment: '实际结束时间',


        },
        cancel_time: {
            type: Sequelize.INTEGER,
            comment: '取消时间',


        },
        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1、未完成。2、已完成。3、已作废',


        },




        executors: {
            type: Sequelize.INTEGER,
            comment: '执行人id',


        },

        acceptor: {
            type: Sequelize.INTEGER,
            comment: '验收人',


        },
        create_user: {
            type: Sequelize.INTEGER,
            comment: '创建人id',


        },

        comment: {
            type: Sequelize.TEXT,
            comment: '任务评论json：[{time:评论时间,message:评论内容，userid：评论用户}]',


        },

        check: {
            type: Sequelize.INTEGER,
            comment: '验收状态：1、验收通过。2、验收驳回',


        },
        complete: {
            type: Sequelize.INTEGER,
            comment: '完成人id',


        },

        reject_reason: {
            type: Sequelize.STRING(255),
            comment: '驳回理由',


        },
        additional: {
            type: Sequelize.INTEGER,
            comment: '是否为研发阶段后追加的任务，是为1，不是为2',


        },

    }, {
        underscored: true,
        tableName: 'task',
        timestamps: false,

    });
    return task;
};