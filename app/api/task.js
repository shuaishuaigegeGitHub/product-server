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
/**
 *保存任务
 */
router.post('/saveTask', async (ctx) => {
    ctx.body = await service.saveTask(ctx.request.body, ctx.state);
});
/**
 * 更新任务
 */
router.post('/updateTask', async (ctx) => {
    ctx.body = await service.updateTask(ctx.request.body, ctx.state);
});
/**
 *查询任务
 */
router.post('/searchTask', async (ctx) => {
    ctx.body = await service.searchTask(ctx.request.body, ctx.state);
});

/**
 * 查询文件
 */
router.post('/taskFile', async (ctx) => {
    ctx.body = await service.taskFile(ctx.request.body);
});

/**
 *删除任务
 */
router.post('/deleteTask', async (ctx) => {
    ctx.body = await service.deleteTask(ctx.request.body);
});
/**
 *验收
 */
router.post('/checkTask', async (ctx) => {
    ctx.body = await service.checkTask(ctx.request.body);
});



export default router;
