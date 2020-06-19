import Router from 'koa-router';
import { query } from '../service/UserService';

const router = new Router({
    prefix: '/user'
});

router.get('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query(ctx.header.token) });
});

export default router;
