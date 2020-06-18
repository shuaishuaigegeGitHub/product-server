import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let sys_log = sequelize.define('sys_log', {
        
        id: {
            type: Sequelize.BIGINT,
            comment: '日志ID',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        method: {
            type: Sequelize.STRING(10),
            comment: '请求方式',
        },
        
        api_path: {
            type: Sequelize.STRING(255),
            comment: '请求路径',
        },
        
        operator: {
            type: Sequelize.STRING(50),
            comment: '操作者',
        },
        
        browser: {
            type: Sequelize.STRING(50),
            comment: '操作浏览器',
        },

        os: {
            type: Sequelize.STRING(50),
            comment: '操作系统',
        },
        
        ip: {
            type: Sequelize.STRING(50),
            comment: '操作IP',
        },
        
        request_time: {
            type: Sequelize.INTEGER,
            comment: '操作时长（单位毫秒）',
        },
        
        detail: {
            type: Sequelize.STRING(255),
            comment: '描述',
        },
        
        request_param: {
            type: Sequelize.STRING(255),
            comment: '请求参数',
        },
        
        response_body: {
            type: Sequelize.TEXT,
            comment: '返回数据',
        },
        
        create_time: {
            type: Sequelize.INTEGER,
            comment: '操作时间',
        },
        
        update_time: {
            type: Sequelize.INTEGER,
            comment: '更新时间',
        },
        
    }, {
        underscored: true,
        tableName: 'sys_log',
        createdAt: 'create_time',
        updatedAt: 'update_time',
        timestamps: false,
        hooks: {
            beforeCreate: (instance, options) => {
                instance.create_time = dayjs().unix();
            }
        }
    });
    return sys_log;
};