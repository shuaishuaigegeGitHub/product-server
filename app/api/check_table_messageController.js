import Router from 'koa-router';
import { findAll, del, update, add } from '../service/check_table_messageService';

const router = new Router({
    prefix: '/check_table_message'
});
//查询
router.get('/', async (ctx) => {
    ctx.body = await findAll(ctx.request.query);
});
//添加
router.post('/add', async (ctx) => {
    ctx.body = await add(ctx.request.body);
});
//更新
router.post('/update', async (ctx) => {
    ctx.body = await update(ctx.request.body);
});
//修改
router.post('/del', async (ctx) => {
    ctx.body = await del(ctx.request.body);
});

export default router;