import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const task_group = sequelize.define('task_group', {

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

        group_name: {
            type: Sequelize.STRING(255),
            comment: '分组名称',


        },

        sort: {
            type: Sequelize.INTEGER,
            comment: '排序',


        },
        type: {
            type: Sequelize.INTEGER,
            comment: '项目类型：初始化自动创建时，1 程序组，2 美术组，3 策划组， 4 运营组。用户自己创建的统一为0',


        },

    }, {
        underscored: true,
        tableName: 'task_group',
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
    return task_group;
};