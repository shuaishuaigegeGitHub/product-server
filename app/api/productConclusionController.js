import Router from 'koa-router';
import {saveConclusion, archiveConclusion, meetingNotice, getConclusion} from '../service/productConclusionService';

const router = new Router({
    prefix: '/product'
});

// 总结编辑接口
router.post('/saveConclusion', async (ctx) => {
    ctx.body = await saveConclusion(ctx.request.body);
});

// 总结归档接口
router.post('/archiveConclusion', async (ctx) => {
    ctx.body = await archiveConclusion(ctx.request.body);
});

// 会议通知接口
router.post('/meetingNotice', async (ctx) => {
    ctx.body = await meetingNotice(ctx.request.body);
});

// 总结查询接口
router.get('/getConclusion', async(ctx) => {
    ctx.body = await getConclusion(ctx.request.query);
});
export default router;