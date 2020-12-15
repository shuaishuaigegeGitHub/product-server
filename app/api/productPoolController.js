import Router from 'koa-router';
import { update, add, cancel, stop, stand, assessment, recovery, reduction, findAll, findDetail, findProject } from '../service/productPoolService';

const router = new Router({
    prefix: '/product'
});
// 添加
router.post('/add', async (ctx) => {
    ctx.body = await add(ctx.request.body, ctx.state);
});
// 更新
router.post('/update', async (ctx) => {
    ctx.body = await update(ctx.request.body, ctx.state);
});
// 作废
router.post('/cancel', async (ctx) => {
    ctx.body = await cancel(ctx.request.body);
});
// 终止
router.post('/stop', async (ctx) => {
    ctx.body = await stop(ctx.request.body);
});
// 立项
router.post('/stand', async (ctx) => {
    ctx.body = await stand(ctx.request.body);
});
// 产品评估
router.post('/assessment', async (ctx) => {
    ctx.body = await assessment(ctx.request.body);
});
// 恢复产品到初始状态
router.post('/recovery', async (ctx) => {
    ctx.body = await recovery(ctx.request.body);
});
// 还原,产品恢复到终止前状态
router.post('/reduction', async (ctx) => {
    ctx.body = await reduction(ctx.request.body);
});
// 产品池查询产品列表
router.get('/findAll', async (ctx) => {
    ctx.body = await findAll(ctx.request.query);
});
// 查询产品详情
router.get('/findDetail', async (ctx) => {
    ctx.body = await findDetail(ctx.request.query);
});
// 查询项目列表
router.get('/project', async(ctx) => {
    ctx.body = await findProject();
});
export default router;