import Router from 'koa-router';
import { query, userMap } from '../service/UserService';

const router = new Router({
    prefix: '/user'
});

router.get('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query(ctx.header.token) });
});

router.get('/map', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await userMap(ctx.header.token) });
});
export default router;
