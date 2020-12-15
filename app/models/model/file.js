import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const file = sequelize.define('file', {

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

        task_id: {
            type: Sequelize.INTEGER,
            comment: '任务id',


        },

        type: {
            type: Sequelize.INTEGER,
            comment: '类型：1、logo。2、二维码。3、会议记录。4、策划文案。5、游戏截图。6、游戏玩法视频。7、策划文案。8、启动会，会议议记录。9、任务附件。10、demo版会议记录',


        },

        check_id: {
            type: Sequelize.INTEGER,
            comment: '类型：1、logo。2、二维码。3、会议记录。4、策划文案。5、游戏截图。6、游戏玩法视频。7、策划文案。8、启动会，会议议记录。9、任务附件。10、demo版会议记录。11、总结项目成果展示',


        },

        name: {
            type: Sequelize.STRING(255),
            comment: '文件名称',


        },

        url: {
            type: Sequelize.STRING(255),
            comment: '文件路径',


        },

        size: {
            type: Sequelize.STRING(30),
            comment: '文件大小',


        },

        create_time: {
            type: Sequelize.INTEGER,
            comment: '创建时间',


        },

        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1、通过。2、未通过',


        },

    }, {
        underscored: true,
        tableName: 'file',
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
    return file;
};