import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let lx_mileage = sequelize.define('lx_mileage', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',
            
            
        },
        
        type: {
            type: Sequelize.INTEGER,
            comment: '类型',
            
            
        },
        
        users: {
            type: Sequelize.STRING(255),
            comment: '人员配置json',
            
            
        },
        
        time: {
            type: Sequelize.STRING(30),
            comment: '配置时间',
            
            
        },
        
    }, {
        underscored: true,
        tableName: 'lx_mileage',
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
    return lx_mileage;
};