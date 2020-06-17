const path = require('path');
const loadEnv = require('node-env-file');

loadEnv(path.resolve(__dirname, '../.env'), { raise: false });

require('babel-polyfill');
require('babel-register');
require('./app');
