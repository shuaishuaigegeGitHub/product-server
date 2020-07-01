import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let project = sequelize.define('project', {

        id: {
            type: Sequelize.INTEGER,
            comment: '项目ID',
            primaryKey: true,
            autoIncrement: true,
        },
        app_id: {
            type: Sequelize.STRING(50),
            comment: 'appId',
        },

        project_logo: {
            type: Sequelize.STRING,
            comment: '项目名称',
        },

        project_name: {
            type: Sequelize.STRING,
            comment: '项目名称',
        },

        group_id: {
            type: Sequelize.INTEGER,
            comment: '项目分组',
        },

        list_id: {
            type: Sequelize.INTEGER,
            comment: '项目列表',
        },

        begin_time: {
            type: Sequelize.INTEGER,
            comment: '项目开始时间',
        },

        end_time: {
            type: Sequelize.INTEGER,
            comment: '项目结束时间',
        },

        priority: {
            type: Sequelize.TINYINT,
            comment: '项目优先级。1：一般，2：紧急，3：非常紧急',
        },

        tag: {
            type: Sequelize.STRING(255),
            comment: '标签',
        },

        remark: {
            type: Sequelize.STRING(255),
            comment: '备注',
        },

        pos: {
            type: Sequelize.INTEGER,
            comment: '位置（根据列表排序）',
        },

        state: {
            type: Sequelize.TINYINT,
            comment: '项目状态。1：正常，0：回收站',
        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',
        },

        update_time: {
            type: Sequelize.INTEGER,
            comment: '最后更新时间',
        },

        create_by: {
            type: Sequelize.STRING(50),
            comment: '创建者',
        },

    }, {
        underscored: true,
        tableName: 'project',
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
    return project;
};