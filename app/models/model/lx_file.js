import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let lx_file = sequelize.define('lx_file', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        type: {
            type: Sequelize.INTEGER,
            comment: '类型：',
            
            
        },
        
        name: {
            type: Sequelize.STRING(255),
            comment: '文件名称',
            
            
        },
        
        path: {
            type: Sequelize.STRING(255),
            comment: '文件路径',
            
            
        },
        
        size: {
            type: Sequelize.INTEGER,
            comment: '文件大小',
            
            
        },
        
        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',
            
            
        },
        
        create_time: {
            type: Sequelize.STRING(50),
            comment: '创建时间',
            
            
        },
        
    }, {
        underscored: true,
        tableName: 'lx_file',
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
    return lx_file;
};