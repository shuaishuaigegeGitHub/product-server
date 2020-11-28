import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let product_check_detail = sequelize.define('product_check_detail', {
        
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
        
        user_id: {
            type: Sequelize.INTEGER,
            comment: '验收人id',
            
            
        },
        
        adopt_result: {
            type: Sequelize.STRING(255),
            comment: '通过结果集合，1通过2不通话，使用逗号隔开如：1，2，1，2，',
            
            
        },
        
        optimization_opinions: {
            type: Sequelize.TEXT,
            comment: '优化意见json:数组',
            
            
        },
        
    }, {
        underscored: true,
        tableName: 'product_check_detail',
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
    return product_check_detail;
};