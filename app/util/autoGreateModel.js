import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '@config/database';
import ejs from 'ejs';

let sequelize = new Sequelize(config.managerServer.database, config.managerServer.username, config.managerServer.password, config.managerServer);

// model模板路径
const modelTemplate = fs.readFileSync(path.resolve(process.cwd(), 'app', 'template', 'model.ejs')).toString();


// model 目录
const MODEL_DIR = path.resolve(process.cwd(), 'app', 'models', 'model');


/**
 * 自动创建model
 * @param {string} tableName 表名
 * @param {boolean} override 如果文件已经存在是否覆盖
 */
export const autoCreateModel = async (tableName, override = false) => {
    let modelFile = path.resolve(MODEL_DIR, tableName + '.js');
    if (fs.existsSync(modelFile) && !override) {
        console.log(`"${modelFile}" 文件已经存在！`);
        return;
    }
    let sql = `
        SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA, COLUMN_COMMENT, ORDINAL_POSITION 
        FROM information_schema.COLUMNS 
        WHERE TABLE_NAME = '${tableName}' 
        ORDER BY ORDINAL_POSITION;
    `;
    let data = await sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    });
    let key = "";
    data = data.map(item => {
        if (item.COLUMN_KEY == "PRI") {
            key = item.COLUMN_NAME;
        }
        let temp = {
            name: item.COLUMN_NAME,
            type: item.COLUMN_TYPE.replace(' unsigned', '').replace('varchar', 'STRING').toUpperCase(),
            primary: item.COLUMN_KEY === 'PRI',
            autoIncrement: item.EXTRA === 'auto_increment',
            comment: item.COLUMN_COMMENT
        };
        if (/^INT/.test(temp.type)) {
            temp.type = 'INTEGER';
        }
        return temp;
    });
    let result = ejs.render(modelTemplate, {
        tableName,
        columns: data
    });
    fs.writeFileSync(modelFile, result);
    await autoCreateService(tableName, data, key);
    await autoCreateController(tableName);
};

/**
 * 生成指定数据库的所有数据表的model
 * @param {string} shcema 数据库名
 * @param {boolean} override 是否覆盖原文件
 */
export const autoCreateSchema = async (shcema, override = false) => {
    let sql = `
        SELECT DISTINCT TABLE_NAME
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = '${shcema}'
        ORDER BY TABLE_NAME;
    `;
    let data = await sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    });
    data = data.map(item => item.TABLE_NAME);
    for (let i = 0; i < data.length; i++) {
        await autoCreateModel(data[i], override);
    }
};
/**
 * 自动生成service层
 * @param {string} tableName 表名称
 * @param {boolean} override 是否覆盖原文件
 */
async function autoCreateService(tableName, columns, key) {
    //    模板路径
    const serviceTemplate = fs.readFileSync(path.resolve(process.cwd(), 'app', 'template', 'server.ejs')).toString();
    // service 目录
    const SERVICE_DIR = path.resolve(process.cwd(), 'app', 'service');
    // 生成service的文件路径
    let serviceFile = path.resolve(SERVICE_DIR, tableName + 'Service.js');
    if (fs.existsSync(serviceFile)) {
        console.log("文件已存在");
        return;
    }
    // 根据模板渲染数据
    let result = ejs.render(serviceTemplate, {
        tableName: tableName,
        columns: columns,
        key: key
    });
    fs.writeFileSync(serviceFile, result);
    console.log("生成service成功");
};
/**
 * 自动生成controller层
 * @param {string} tableName 表名称
 * @param {boolean} override 是否覆盖原文件
 */
async function autoCreateController(tableName, columns, key) {
    //    模板路径
    const template = fs.readFileSync(path.resolve(process.cwd(), 'app', 'template', 'controller.ejs')).toString();
    // Controller 目录
    const SERVICE_DIR = path.resolve(process.cwd(), 'app', 'api');
    // 生成service的文件路径
    let controllerFile = path.resolve(SERVICE_DIR, tableName + 'Controller.js');
    if (fs.existsSync(controllerFile)) {
        console.log("文件已存在");
        return;
    }
    // 根据模板渲染数据
    let result = ejs.render(template, {
        tableName: tableName,
    });
    fs.writeFileSync(controllerFile, result);
    console.log("生成Controller成功");
};