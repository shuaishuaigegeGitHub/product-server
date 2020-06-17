import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '@config/database';

const basename = path.basename(module.filename);
const db = {};

let sequelize = null;

sequelize = new Sequelize(config.managerServer.database, config.managerServer.username, config.managerServer.password, config.managerServer);

fs.readdirSync(`${__dirname}/model`)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(`${__dirname}/model`, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

export default db;