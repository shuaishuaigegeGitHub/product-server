import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let u_theme = sequelize.define('u_theme', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        theme: {
            type: Sequelize.STRING(255),
            comment: '游戏题材',


        },
        create_time: {
            type: Sequelize.STRING(30),
            comment: '创建时间',


        },

    }, {
        underscored: true,
        tableName: 'u_theme',
        timestamps: false,

    });
    return u_theme;
};