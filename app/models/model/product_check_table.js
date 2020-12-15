import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let product_check_table = sequelize.define('product_check_table', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        check_id: {
            type: Sequelize.INTEGER,
            comment: '验收表id',


        },

        type: {
            type: Sequelize.INTEGER,
            comment: '类型：1 程序，2 策划，3 美术',


        },

        message_id: {
            type: Sequelize.INTEGER,
            comment: '验收内容id',


        },

        result: {
            type: Sequelize.INTEGER,
            comment: '结果，1通过，2不通过，0未填写',


        },

    }, {
        underscored: true,
        tableName: 'product_check_table',
        timestamps: false,
    });
    return product_check_table;
};