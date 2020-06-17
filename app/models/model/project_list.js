import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let project_list = sequelize.define('project_list', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: 'ID',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        list_name: {
            type: Sequelize.STRING(50),
            comment: '列表名称',
        },
        
        group_id: {
            type: Sequelize.INTEGER,
            comment: '组ID',
        },
        
        pos: {
            type: Sequelize.INTEGER,
            comment: '位置（根据组排序）',
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
        tableName: 'project_list',
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
    return project_list;
};