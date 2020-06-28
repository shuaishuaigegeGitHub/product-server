import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let task_type = sequelize.define('task_type', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: 'ID',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        group_id: {
            type: Sequelize.INTEGER,
            comment: '部门ID',
            
            
        },
        
        type_name: {
            type: Sequelize.STRING(50),
            comment: '任务类型名称',
            
            
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
        tableName: 'task_type',
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
    return task_type;
};