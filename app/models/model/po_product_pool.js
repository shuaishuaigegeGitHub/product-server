import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let po_product_pool = sequelize.define('po_product_pool', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: Sequelize.STRING(255),
            comment: '产品池名称',


        },

        create_time: {
            type: Sequelize.STRING(20),
            comment: '创建时间',


        },

        remark: {
            type: Sequelize.STRING(255),
            comment: '备注',


        },

    }, {
        underscored: true,
        tableName: 'po_product_pool',

        timestamps: false,

    });
    return po_product_pool;
};