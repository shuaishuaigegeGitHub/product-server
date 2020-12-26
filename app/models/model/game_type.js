

module.exports = function (sequelize, Sequelize) {
    let game_type = sequelize.define('game_type', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',

            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: Sequelize.STRING(255),
            comment: '游戏类型名称',


        },

    }, {
        underscored: true,
        tableName: 'game_type',
        timestamps: false,
    });
    return game_type;
};