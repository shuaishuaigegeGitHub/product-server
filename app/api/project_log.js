import Router from 'koa-router';
import { query } from '../service/ProjectLogService';

const router = new Router({
    prefix: '/project-log'
});

/**
 * 查询项目动态
 * @param {number} 项目ID
 */
router.get('/:id', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query(ctx.params.id, ctx.query) });
});

export default router;
