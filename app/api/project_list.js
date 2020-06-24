import Router from 'koa-router';
import { query, update, del, add, updatePos, searchproject_list } from '../service/ProjectListService';

const router = new Router({
    prefix: '/project-list'
});

/**
 * 获取指定组的项目列表
 * @param {number} groupId 组ID
 */
router.get('/:groupId', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query(ctx.params.groupId, ctx.query) });
});

/**
 * 创建项目列表
 * @param {number} group_id 组ID
 * @param {string} list_name 列表名称
 */
router.post('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '创建成功', data: await add(ctx.request.body) });
});

/**
 * 删除项目列表，将会把该项目列表下的所有项目转移到回收站
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

/**
 * 更新项目列表顺序
 */
router.post('/pos', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updatePos(ctx.request.body) });
});



/**
 * 只查询项目列表没有项目信息
 */
router.post('/searchproject_list', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await searchproject_list(ctx.request.body.group_id) });
});


export default router;
