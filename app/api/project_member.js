import Router from 'koa-router';
import { add } from '../service/ProjectMemberService';

const router = new Router({
    prefix: '/project-member'
});

/**
 * 项目添加参与者
 */
router.post('/', async (ctx) => {
    let memberList = ctx.request.body;
    await add(memberList);
    ctx.body = ctx.renderJson({ msg: '添加成功' });
});

export default router;
