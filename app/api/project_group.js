import Router from 'koa-router';
import { query, update, del, add } from '../service/ProjectGroupService';

const router = new Router({
    prefix: '/project-group'
});

/**
 * 查询所有项目组
 */
router.get('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query() });
});

/**
 * 创建项目组
 * @param {string} group_name 组名
 * @param {string} remark 备注
 */
router.post('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '创建成功', data: await add(ctx.request.body) });
});

/**
 * 删除项目分组，将会把该项目分组下的所有项目转移到回收站
 * @param {number} id 
 */
router.del('/:id', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '删除成功', data: await del(ctx.params.id) });
});

/**
 * 更新项目列表
 */
router.put('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update(ctx.request.body) });
});

export default router;
