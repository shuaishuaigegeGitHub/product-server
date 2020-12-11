/*
 * @Author: Welman
 * @Email: zhengweiman@yeah.net
 * @Date: 2018-06-09 17:55:45
 */

'use strict';

const path = require('path');
const loadEnv = require('node-env-file');

loadEnv(path.resolve(__dirname, '../.env'), {
    raise: false
});

export default {
    managerServer: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        seederStorage: 'sequelize',
        pool: {
            max: 50,
            min: 0,
            idle: 30000,
        },
        query: { raw: true },
        // 修复中国时区问题
        timezone: '+08:00',
        logging: false,
    }
};