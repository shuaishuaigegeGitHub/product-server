import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let person = sequelize.define('person', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        user_id: {
            type: Sequelize.INTEGER,
            comment: '参与者id',
            
            
        },
        
        user_name: {
            type: Sequelize.STRING(255),
            comment: '参与者名称',
            
            
        },
        
        type: {
            type: Sequelize.INTEGER,
            comment: '参与者角色：1.美术，2.程序，3.策划，4.运营',
            
            
        },
        
        product_id: {
            type: Sequelize.INTEGER,
            comment: '项目id',
            
            
        },
        
        check: {
            type: Sequelize.INTEGER,
            comment: '任务排期是否验收。1、未验收。2、已验收',
            
            
        },
        
    }, {
        underscored: true,
        tableName: 'person',
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
    return person;
};