import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let file = sequelize.define('file', {

        id: {
            type: Sequelize.BIGINT(20),
            comment: 'ID',
            primaryKey: true,
            autoIncrement: true,
        },

        task_id: {
            type: Sequelize.BIGINT(20),
            comment: '任务ID',


        },

        tast_type: {
            type: Sequelize.INTEGER,
            comment: '任务类型',


        },

        project_id: {
            type: Sequelize.INTEGER,
            comment: '项目ID',


        },

        parent_id: {
            type: Sequelize.BIGINT(20),
            comment: '父级目录ID',


        },

        origin_name: {
            type: Sequelize.STRING(255),
            comment: '自定义文件名'
        },

        url: {
            type: Sequelize.STRING(255),
            comment: '文件路径（只有文件才有）',


        },

        size: {
            type: Sequelize.STRING(20),
            comment: '文件大小。目录为：&#39;-&#39;，文件为真实大小：&#39;12kb&#39;',


        },

        create_by: {
            type: Sequelize.STRING(50),
            comment: '创建者',


        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间'
        },

        update_time: {
            type: Sequelize.INTEGER,
            comment: '最后更新时间',
        },

    }, {
        underscored: true,
        tableName: 'file',
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
    return file;
};