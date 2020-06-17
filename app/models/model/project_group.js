import dayjs from 'dayjs'

module.exports = function(sequelize, Sequelize) {
    let project_group = sequelize.define('project_group', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '组ID',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        group_name: {
            type: Sequelize.STRING(50),
            comment: '组名',
        },
        
        remark: {
            type: Sequelize.STRING(255),
            comment: '备注',
        },
        
        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',
        },
        
        update_time: {
            type: Sequelize.INTEGER,
            comment: '修改时间',
        },
        
    }, {
        underscored: true,
        tableName: 'project_group',
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
    return project_group;
};