import dayjs from 'dayjs'

module.exports = function(sequelize, Sequelize) {
    let project_log = sequelize.define('project_log', {
        id: {
            type: Sequelize.BIGINT,
            comment: 'ID',
            primaryKey: true, 
            autoIncrement: true, 
        },
        project_id: {
            type: Sequelize.INTEGER,
            comment: '项目ID',
        },
        operator: {
            type: Sequelize.STRING(50),
            comment: '操作者',
        },
        column_name: {
            type: Sequelize.STRING,
            comment: '修改字段',
        },
        content: {
            type: Sequelize.STRING,
            comment: '更新内容',
        },
        detail: {
            type: Sequelize.STRING(255),
            comment: '操作详细描述',
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
        tableName: 'project_log',
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
    return project_log;
};