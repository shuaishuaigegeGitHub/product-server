// 研发列表
import Router from 'koa-router';
import { noticeOfmeeting } from "../service/researchTableService";
const router = new Router({
    prefix: '/researchTable'
});
// 发起会议通知
router.post("/noticeOfmeeting", async (ctx) => {
    ctx.body = await noticeOfmeeting(ctx.request.body, ctx.request.headers["token"]);

});

export default router;