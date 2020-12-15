import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const product_check_detail = sequelize.define('product_check_detail', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        master_id: {
            type: Sequelize.INTEGER,
            comment: '主表id',
        },

        user_id: {
            type: Sequelize.INTEGER,
            comment: '验收人id',
        },
        type: {
            type: Sequelize.INTEGER,
            comment: '类型：1 程序，2 策划，3 美术',
        },

        adopt_result: {
            type: Sequelize.TEXT,
            comment: 'demo版为整张验收表组成的json\n体验版 json集合[{problem：问题，programme：方案，username:人员名称}]',
        },
        optimization_opinions: {
            type: Sequelize.TEXT,
            comment: '优化意见json:数组',
        },
        total_score: {
            type: Sequelize.INTEGER,
            comment: '得分',
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