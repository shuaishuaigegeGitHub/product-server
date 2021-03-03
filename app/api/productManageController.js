import Router from 'koa-router';
import * as service from '../service/productManageService';

const router = new Router({
    prefix: '/productManageService'
});
/**
 * 初始化
 */
router.post('/init', async ctx => {
    ctx.body = await service.init(ctx.request.body);
});

/**
 * 保存基础配置
 */
router.post('/basic_Configuration', async ctx => {
    ctx.body = await service.basic_Configuration(ctx.request.body);
});

/**
 * 查询基础配置
 */
router.get('/findBaseConfig', async ctx => {
    ctx.body = await service.findBaseConfig(ctx.request.query);
});

/**
 * 保存人员配置
 */
router.post('/personSave', async ctx => {
    ctx.body = await service.personSave(ctx.request.body);
});

/**
 * 查询产品人员配置
 */
router.get('/findProductPeson', async ctx => {
    ctx.body = await service.findProductPeson(ctx.request.query);
});

/**
 * 生成里程碑
 */
router.post('/fixedFile', async ctx => {
    ctx.body = await service.fixedFile(ctx.request.body);
});

/**
 * 保存里程碑
 */
router.post('/updateMilepost', async ctx => {
    ctx.body = await service.updateMilepost(ctx.request.body);
});

/**
 * 查询里程碑
 */
router.get('/findeMilepost', async ctx => {
    ctx.body = await service.findeMilepost(ctx.request.query);
});
/**
 * 文件管理文件查询
 */
router.get('/findManageFileAll', async ctx => {
    ctx.body = await service.findManageFileAll(ctx.request.query);
});
/**
 * 添加分组
 */
router.post('/addGroup', async ctx => {
    ctx.body = await service.addGroup(ctx.request.body);
});
/**
 * 修改分组
 */
router.post('/updateGroup', async ctx => {
    ctx.body = await service.updateGroup(ctx.request.body);
});

/**
 * 删除分组
 */
router.post('/delGroup', async ctx => {
    ctx.body = await service.delGroup(ctx.request.body);
});
/**
 * 查询分组
 */
router.get('/findGroup', async ctx => {
    ctx.body = await service.findGroup(ctx.request.query);
});
/**
 * 添加任务
 */
router.post('/addTask', async ctx => {
    ctx.body = await service.addTask(ctx.request.body, ctx.state);
});
/**
 * 查询阶段任务
 */
router.post('/selectPhaseTask', async ctx => {
    ctx.body = await service.selectPhaseTask(ctx.request.body);
});
/**
 * 更新任务
 */
router.post('/updateTask', async ctx => {
    ctx.body = await service.updateTask(
        ctx.request.body,
        ctx.state,
        ctx.request.headers.token
    );
});
/**
 * 更新任务单个数据
 */
router.post('/updateItem', async ctx => {
    ctx.body = await service.updateItem(
        ctx.request.body,
        ctx.state,
        ctx.request.headers.token
    );
});
/**
 * 作废任务
 */
router.post('/cancelTask', async ctx => {
    ctx.body = await service.cancelTask(ctx.request.body, ctx.state);
});
/**
 * 任务添加附件
 */
router.post('/taskAddFile', async ctx => {
    ctx.body = await service.taskAddFile(ctx.request.body, ctx.state);
});
/**
 * 任务删除附件
 */
router.post('/taskDelFile', async ctx => {
    ctx.body = await service.taskDelFile(ctx.request.body, ctx.state);
});
/**
 * 添加子任务
 */
router.post('/addSubset', async ctx => {
    ctx.body = await service.addSubset(ctx.request.body, ctx.state);
});
/**
 * 查询子任务
 */
router.get('/findSubset', async ctx => {
    ctx.body = await service.findSubset(ctx.request.query);
});
/**
 * 完成子任务
 */
router.post('/updateSubset', async ctx => {
    ctx.body = await service.updateSubset(ctx.request.body, ctx.state);
});
/**
 * 添加评论
 */
router.post('/addComment', async ctx => {
    ctx.body = await service.addComment(ctx.request.body, ctx.state);
});
/**
 * 查询产品所有任务并按照分组进行划分
 */
router.get('/findProductTaskAll', async ctx => {
    ctx.body = await service.findProductTaskAll(
        ctx.request.query,
        ctx.request.headers.token
    );
});
/**
 * 按照分组查询任务
 */
router.get('/findGroupTask', async ctx => {
    ctx.body = await service.findGroupTask(
        ctx.request.query,
        ctx.request.headers.token
    );
});
/**
 * 查询任务详情
 */
router.get('/findTaskDetail', async ctx => {
    ctx.body = await service.findTaskDetail(
        ctx.request.query,
        ctx.request.headers.token
    );
});
/**
 * 完成任务
 */
router.post('/completeTask', async ctx => {
    ctx.body = await service.completeTask(ctx.request.body, ctx.state);
});
/**
 * 取消完成任务
 */
router.post('/cancelCompleteTask', async ctx => {
    ctx.body = await service.cancelCompleteTask(ctx.request.body);
}),
    /**
     * 查询研发中到上线推广中的产品名称和id
     */
    router.get('/idAndName', async ctx => {
        ctx.body = await service.idAndName(
            ctx.state,
            ctx.request.headers.token
        );
    });
/**
 * 查询我的任务
 */
router.get('/findMyTask', async ctx => {
    ctx.body = await service.findMyTask(
        ctx.request.query,
        ctx.state,
        ctx.request.headers.token
    );
});
export default router;
