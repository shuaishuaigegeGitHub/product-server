import Router from 'koa-router';
import * as service from '../service/TaskService';

const router = new Router({
    prefix: '/task'
});

/**
 * 获取任务类型
 */
router.post('/taskTypes', async (ctx) => {
    ctx.body = await service.taskTypes();
});
/**
 * 获取任务模块
 */
router.post('/taskModule', async (ctx) => {
    ctx.body = await service.taskModule(ctx.request.body);
});


export default router;
