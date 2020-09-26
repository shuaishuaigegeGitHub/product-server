import Router from "koa-router";
import { updateProduct, productStatus, addTask, updateTask, checkTask, delTask, findTask, searchProduct, savePerson, saveMileage, manageSearchTask, userFimdTask, searchMileage } from "../service/ProjectApprovalService";

const router = new Router({
    prefix: "/projectApproval"
});

//  更新产品数据
router.post("/updateProduct", async (ctx) => {
    ctx.body = await updateProduct(ctx.request.body);
});
//  更改产品状态
router.post("/productStatus", async (ctx) => {
    ctx.body = await productStatus(ctx.request.body);
});
// 添加任务
router.post("/addTask", async (ctx) => {
    ctx.body = await addTask(ctx.request.body, ctx.state);
});
// 修改任务
router.post("/updateTask", async (ctx) => {
    ctx.body = await updateTask(ctx.request.body);
});
//  验收任务
router.post("/checkTask", async (ctx) => {
    ctx.body = await checkTask(ctx.request.body);
});
// 删除任务
router.post("/delTask", async (ctx) => {
    ctx.body = await delTask(ctx.request.body);
});
// 查询任务
router.post("/findTask", async (ctx) => {
    ctx.body = await findTask(ctx.request.body);
});

// 查询产品数据
router.post("/searchProduct", async (ctx) => {
    ctx.body = await searchProduct(ctx.request.body, ctx.state);
});
//  保存人员配置
router.post("/savePerson", async (ctx) => {
    ctx.body = await savePerson(ctx.request.body);
});

// 保存里程
router.post("/saveMileage", async (ctx) => {
    ctx.body = await saveMileage(ctx.request.body);
});
// 查询里程
router.post("/searchMileage", async (ctx) => {
    ctx.body = await searchMileage(ctx.request.body);
});
// 负责人按日期，任务负责人查询单个项目的任务
router.post("/manageSearchTask", async (ctx) => {
    ctx.body = await manageSearchTask(ctx.request.body);
});
// 项目参与者按日期查询自己的任务
router.post("/userFimdTask", async (ctx) => {
    ctx.body = await userFimdTask(ctx.request.body);
});




export default router;