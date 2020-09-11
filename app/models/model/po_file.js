import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let po_file = sequelize.define('po_file', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        type: {
            type: Sequelize.INTEGER,
            comment: '类型：1、logo。2、二维码。3、会议记录。4、策划文案。5、游戏截图。6、游戏玩法视频',


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

    }, {
        underscored: true,
        tableName: 'po_file',
        timestamps: false,
    });
    return po_file;
};