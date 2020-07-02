import Router from 'koa-router';
import { add, searchProjectMember, deleteProjectMember } from '../service/ProjectMemberService';
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
/**
 *查找项目参与者
 */
router.post('/searchProjectMember', async (ctx) => {
    ctx.body = await searchProjectMember(ctx.request.body);
});
/**
 *删除项目参与者
 */
router.post('/deleteProjectMember', projectLog({ describe: '删除参与者：', projectIdColumnName: "project_id", contentColumnName: 'username', action: 'DEL_PARTNER' }), async (ctx) => {
    ctx.body = await deleteProjectMember(ctx.request.body);
});
export default router;
