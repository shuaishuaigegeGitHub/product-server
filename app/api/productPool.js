import Router from "koa-router";
import { poolSave, poolUpdate, pooldel, poolSearch, productSave, productUpdate, productCancel, productReduction, productDelete, productSearch, themeSave, themeUpdate, themeDel, themeSearch, projectApproval } from "../service/ProductPoolService";

const router = new Router({
    prefix: "/procuctPool"
});


// 产品池保存
router.post("/poolSave", async (ctx) => {
    ctx.body = await poolSave(ctx.request.body);
});
// 产品池更新
router.post("/poolUpdate", async (ctx) => {
    ctx.body = await poolUpdate(ctx.request.body);
});
// 产品池删除
router.post("/pooldel", async (ctx) => {
    ctx.body = await pooldel(ctx.request.body);
});
// 产品池查询
router.post("/poolSearch", async (ctx) => {
    ctx.body = await poolSearch(ctx.request.body);
});
// 保存产品数据
router.post("/productSave", async (ctx) => {
    ctx.body = await productSave(ctx.request.body);
});
// 更新产品数据
router.post("/productUpdate", async (ctx) => {
    ctx.body = await productUpdate(ctx.request.body);
});
// 作废产品
router.post("/productCancel", async (ctx) => {
    ctx.body = await productCancel(ctx.request.body);
});
// 还原产品
router.post("/productReduction", async (ctx) => {
    ctx.body = await productReduction(ctx.request.body);
});
// 删除产品
router.post("/productDelete", async (ctx) => {
    ctx.body = await productDelete(ctx.request.body);
});
//  查询产品数据
router.post("/productSearch", async (ctx) => {
    ctx.body = await productSearch(ctx.request.body);
});
//  游戏题材保存
router.post("/themeSave", async (ctx) => {
    ctx.body = await themeSave(ctx.request.body);
});
// 游戏题材修改
router.post("/themeUpdate", async (ctx) => {
    ctx.body = await themeUpdate(ctx.request.body);
});
//  游戏题材删除
router.post("/themeDel", async (ctx) => {
    ctx.body = await themeDel(ctx.request.body);
});
//  游戏题材查询
router.post("/themeSearch", async (ctx) => {
    ctx.body = await themeSearch(ctx.request.body);
});
// 产品池项目立项转到立项表
router.post("/projectApproval", async (ctx) => {
    ctx.body = await projectApproval(ctx.request.body);
});
export default router;