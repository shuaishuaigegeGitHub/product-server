import Router from 'koa-router';
import compose from 'koa-compose';
import fs from 'fs';

const router = new Router();

const files = fs.readdirSync(`${__dirname}/../api`);
const controllerFiles = files.filter(f => f.endsWith('.js'));

router.get('/', async(ctx) => {
    ctx.body = {
        code: 404,
        msg: 'not found'
    };
});

controllerFiles.map(item => {
    const routes = require(`../api/${item}`).default;
    router.use('/api', routes.routes(), routes.allowedMethods());
});

export default function routes() {
    return compose([
        router.routes(),
        router.allowedMethods()
    ]);
}