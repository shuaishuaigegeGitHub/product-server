// 研发列表
import Router from 'koa-router';
import { findProduct, nextStage, noticeOfmeeting, demoCheckTableSave, taskAddFile, taskDelFile, commitReport, demoExperienceReport, experienceCommit, findExperienceTable, findHistory } from "../service/researchTableService";
const router = new Router({
    prefix: '/researchTable'
});


/**
 * 根据状态查询产品
 */
router.get("/findProduct", async (ctx) => {
    ctx.body = await findProduct(ctx.request.query, ctx.request.headers["token"]);

});
// 进入下一阶段
router.post("/nextStage", async (ctx) => {
    ctx.body = await nextStage(ctx.request.body);

});
// 发起会议通知
router.post("/noticeOfmeeting", async (ctx) => {
    ctx.body = await noticeOfmeeting(ctx.request.body, ctx.request.headers["token"]);

});
// demo版验收表保存
router.post("/demoCheckTableSave", async (ctx) => {
    ctx.body = await demoCheckTableSave(ctx.request.body, ctx.state);

});
// 添加会议记录
router.post("/taskAddFile", async (ctx) => {
    ctx.body = await taskAddFile(ctx.request.body);

});
// 删除会议记录
router.post("/taskDelFile", async (ctx) => {
    ctx.body = await taskDelFile(ctx.request.body);

});
// demo体验报告提交
router.post("/commitReport", async (ctx) => {
    ctx.body = await commitReport(ctx.request.body);

});
/**
 * 查询demo版体验报告
 */
router.get("/demoExperienceReport", async (ctx) => {
    ctx.body = await demoExperienceReport(ctx.request.query);

});
// 体验版验收报告提交
router.post("/experienceCommit", async (ctx) => {
    ctx.body = await experienceCommit(ctx.request.body, ctx.state);

});
/**
 * 体验版验收报告查询
 */
router.get("/findExperienceTable", async (ctx) => {
    ctx.body = await findExperienceTable(ctx.request.query);

});
/**
 * 体验版验收报告查询
 */
router.get("/findHistory", async (ctx) => {
    ctx.body = await findHistory(ctx.request.query, ctx.request.headers["token"]);

});
export default router;