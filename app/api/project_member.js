import Router from 'koa-router';
import { add } from '../service/ProjectMemberService';
import projectLog from '@app/middleware/ProjectLog';

const router = new Router({
    prefix: '/project-member'
});

/**
 * 项目添加参与者
 */
router.post('/', projectLog({ describe: '添加参与者：', contentColumnName: 'project_name', action: 'ADD_PARTNER' }), async (ctx) => {
    let memberList = ctx.request.body;
    await add(memberList);
    ctx.body = ctx.renderJson({ msg: '添加成功' });
});

export default router;
