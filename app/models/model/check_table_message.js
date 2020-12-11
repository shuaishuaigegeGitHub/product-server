import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    let check_table_message = sequelize.define('check_table_message', {

        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        level: {
            type: Sequelize.INTEGER,
            comment: '验收层级：1为模块，2 为验收点',


        },

        type: {
            type: Sequelize.INTEGER,
            comment: '验收的类型：1 程序，2 策划，3 美术',


        },

        parent_id: {
            type: Sequelize.INTEGER,
            comment: '父级id',


        },

        sort: {
            type: Sequelize.INTEGER,
            comment: '排序',


        },
        num: {
            type: Sequelize.DOUBLE,
            comment: '分数',


        },
        check_message: {
            type: Sequelize.STRING(255),
            comment: '验收模块，或者验收点',


        },

        supplement: {
            type: Sequelize.STRING(255),
            comment: '补充说明',


        },

    }, {
        underscored: true,
        tableName: 'check_table_message',
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
    return check_table_message;
};