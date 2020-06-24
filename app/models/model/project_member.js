import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let project_member = sequelize.define('project_member', {
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
        },
        project_id: {
            type: Sequelize.INTEGER,
            comment: '项目ID',
        },
        user_id: {
            type: Sequelize.INTEGER,
            comment: '用户ID',
        },
        username: {
            type: Sequelize.STRING(50),
            comment: '用户名',
        },
        avatar: {
            type: Sequelize.STRING(255),
            comment: '头像',
        },
        role: {
            type: Sequelize.STRING(100),
            comment: '角色。PARTNET: 参与者，PRINCIPAL：负责人',
        },
        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',
        },
        update_time: {
            type: Sequelize.INTEGER,
            comment: '最后修改时间',
        },
        partner_role: {
            type: Sequelize.INTEGER,
            comment: '参与角色',
        },
    }, {
        underscored: true,
        tableName: 'project_member',
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
    return project_member;
};