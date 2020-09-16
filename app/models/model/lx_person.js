import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let lx_person = sequelize.define('lx_person', {

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
            comment: '参与者角色：1.负责人，2.美术，3.程序，4.策划，5.运营',


        },

        product_id: {
            type: Sequelize.INTEGER,
            comment: '项目id',


        },

    }, {
        underscored: true,
        tableName: 'lx_person',
        timestamps: false,
    });
    return lx_person;
};