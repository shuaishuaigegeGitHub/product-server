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

    }, {
        underscored: true,
        tableName: 'u_theme',
        timestamps: false,

    });
    return u_theme;
};