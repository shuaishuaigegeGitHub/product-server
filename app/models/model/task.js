import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let task = sequelize.define('task', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        id: {
            type: Sequelize.INTEGER,
            comment: '任务id',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',
            
            
        },
        
        user_id: {
            type: Sequelize.INTEGER,
            comment: '创建用户id',
            
            
        },
        
        group_id: {
            type: Sequelize.INTEGER,
            comment: '分组id',
            
            
        },
        
        deadline: {
            type: Sequelize.INTEGER,
            comment: '截止时间',
            
            
        },
        
        label: {
            type: Sequelize.INTEGER,
            comment: '任务标签',
            
            
        },
        
        task_content: {
            type: Sequelize.STRING(2550),
            comment: '任务内容',
            
            
        },
        
        title: {
            type: Sequelize.STRING(255),
            comment: '任务标题',
            
            
        },
        
        cron_date: {
            type: Sequelize.STRING(2550),
            comment: '提醒表达式',
            
            
        },
        
        describe: {
            type: Sequelize.STRING(255),
            comment: '任务描述',
            
            
        },
        
        status: {
            type: Sequelize.INTEGER,
            comment: '0-已删除，1-进行中，2-全部完成，3-逾期',
            
            
        },
        
        start_time: {
            type: Sequelize.INTEGER,
            comment: '任务开始时间',
            
            
        },
        
        remark: {
            type: Sequelize.STRING(2550),
            comment: '备注',
            
            
        },
        
        end_time: {
            type: Sequelize.INTEGER,
            comment: '任务结束时间',
            
            
        },
        
        createtime: {
            type: Sequelize.INTEGER,
            comment: '创建时间',
            
            
        },
        
        real_create_time: {
            type: Sequelize.INTEGER,
            comment: '实际开始时间',
            
            
        },
        
        updatetime: {
            type: Sequelize.INTEGER,
            comment: '修改时间',
            
            
        },
        
        real_end_time: {
            type: Sequelize.INTEGER,
            comment: '实际结束时间',
            
            
        },
        
        is_self: {
            type: Sequelize.INTEGER,
            comment: '是否指派自己   0--否 ，1--是',
            
            
        },
        
        cancel_time: {
            type: Sequelize.INTEGER,
            comment: '取消时间',
            
            
        },
        
        is_subject: {
            type: Sequelize.INTEGER,
            comment: '是否重复任务主体',
            
            
        },
        
        layer: {
            type: Sequelize.INTEGER,
            comment: '层级：1、第一级。2、子级',
            
            
        },
        
        parent_id: {
            type: Sequelize.INTEGER,
            comment: '父级id',
            
            
        },
        
        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1、未完成。2、已完成。3、已作废',
            
            
        },
        
        executors: {
            type: Sequelize.STRING(255),
            comment: '执行人们id字符串，用逗号隔开',
            
            
        },
        
        acceptor: {
            type: Sequelize.INTEGER,
            comment: '验收人',
            
            
        },
        
        comment: {
            type: Sequelize.TEXT,
            comment: '任务评论json：[{time:评论时间,message:评论内容，userid：评论用户}]',
            
            
        },
        
        check: {
            type: Sequelize.INTEGER,
            comment: '验收状态：1、验收通过。2、验收驳回',
            
            
        },
        
        reject_reason: {
            type: Sequelize.STRING(255),
            comment: '驳回理由',
            
            
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