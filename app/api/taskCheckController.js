import Router from 'koa-router';
import { findCheckTask, productExecutors, checkAndAdopt, checkAndAdoptNo } from "../service/taskCheckService";
const router = new Router({
    prefix: '/taskCheck'
});

/**
 * 查找当前用户需要验收的任务
 */
router.get("/findCheckTask", async (ctx) => {
    ctx.body = await findCheckTask(ctx.request.query, ctx.state, ctx.headers["token"]);
});
/**
 * 根据产品和执行人查询当前用户需要验收的任务
 */
router.get("/productExecutors", async (ctx) => {
    ctx.body = await productExecutors(ctx.request.query, ctx.state, ctx.headers["token"]);
});
/**
 * 验收通过
 */
router.post("/checkAndAdopt", async (ctx) => {
    ctx.body = await checkAndAdopt(ctx.request.body);
});
/**
 * 验收驳回
 */
router.post("/checkAndAdoptNo", async (ctx) => {
    ctx.body = await checkAndAdoptNo(ctx.request.body);
});
export default router;