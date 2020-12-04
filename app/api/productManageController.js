import Router from "koa-router";
import * as  service from "../service/productManageService";
const router = new Router({
    prefix: "/productManageService"
});
/**
 * 初始化
 */
router.post("/init", async (ctx) => {
    ctx.body = service.init(ctx.request.body);
});

/**
 * 保存基础配置
 */
router.post("/basic_Configuration", async (ctx) => {
    ctx.body = service.basic_Configuration(ctx.request.body);
});

/**
 * 查询基础配置
 */
router.get("/findBaseConfig", async (ctx) => {
    ctx.body = service.findBaseConfig(ctx.request.query);
});


/**
 * 保存人员配置
 */
router.post("/personSave", async (ctx) => {
    ctx.body = service.personSave(ctx.request.body);
});

/**
 * 查询产品人员配置
 */
router.get("/findProductPeson", async (ctx) => {
    ctx.body = service.findProductPeson(ctx.request.query);
});

/**
 * 生成里程碑
 */
router.post("/fixedFile", async (ctx) => {
    ctx.body = service.fixedFile(ctx.request.body);
});

/**
 * 保存里程碑
 */
router.post("/updateMilepost", async (ctx) => {
    ctx.body = service.updateMilepost(ctx.request.body);
});

/**
 * 查询里程碑
 */
router.get("/findeMilepost", async (ctx) => {
    ctx.body = service.findeMilepost(ctx.request.query);
});
/**
 * 文件管理文件查询
 */
router.get("/findManageFileAll", async (ctx) => {
    ctx.body = service.findManageFileAll(ctx.request.query);
});
/**
 * 添加分组
 */
router.post("/addGroup", async (ctx) => {
    ctx.body = service.addGroup(ctx.request.body);
});
/**
 * 修改分组
 */
router.post("/updateGroup", async (ctx) => {
    ctx.body = service.updateGroup(ctx.request.body);
});

/**
 * 删除分组
 */
router.post("/delGroup", async (ctx) => {
    ctx.body = service.delGroup(ctx.request.body);
});
/**
 * 查询分组
 */
router.get("/findGroup", async (ctx) => {
    ctx.body = service.findGroup(ctx.request.query);
});
/**
 * 添加任务
 */
router.post("/addTask", async (ctx) => {
    ctx.body = service.addTask(ctx.request.body);
});
/**
 * 更新任务
 */
router.post("/updateTask", async (ctx) => {
    ctx.body = service.updateTask(ctx.request.body);
});
/**
 * 作废任务
 */
router.post("/cancelTask", async (ctx) => {
    ctx.body = service.cancelTask(ctx.request.body);
});
/**
 * 任务添加附件
 */
router.post("/taskAddFile", async (ctx) => {
    ctx.body = service.taskAddFile(ctx.request.body);
});
/**
 * 任务删除附件
 */
router.post("/taskDelFile", async (ctx) => {
    ctx.body = service.taskDelFile(ctx.request.body);
});
/**
 * 添加子任务
 */
router.post("/addSubset", async (ctx) => {
    ctx.body = service.addSubset(ctx.request.body);
});
/**
 * 完成子任务
 */
router.post("/updateSubset", async (ctx) => {
    ctx.body = service.updateSubset(ctx.request.body);
});
/**
 * 添加评论
 */
router.post("/addComment", async (ctx) => {
    ctx.body = service.addComment(ctx.request.body);
});
/**
 * 查询产品所有任务并按照分组进行划分
 */
router.post("/findProductTaskAll", async (ctx) => {
    ctx.body = service.findProductTaskAll(ctx.request.body);
});
/**
 * 按照分组查询任务
 */
router.post("/findGroupTask", async (ctx) => {
    ctx.body = service.findGroupTask(ctx.request.body);
});
/**
 * 查询任务详情
 */
router.post("/findTaskDetail", async (ctx) => {
    ctx.body = service.findTaskDetail(ctx.request.body);
});
/**
 * 完成任务
 */
router.post("/completeTask", async (ctx) => {
    ctx.body = service.completeTask(ctx.request.body);
});
export default router;