import Router from "koa-router";
import { updateProduct, productStatus, addTask, updateTask, checkTask, delTask, findTask, searchProduct } from "../service/ProjectApprovalService";

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
    ctx.body = await addTask(ctx.request.body);
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
    ctx.body = await searchProduct(ctx.request.body);
});





export default router;