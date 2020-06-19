import Router from 'koa-router';
import { query, update, del, add } from '../service/ProjectService';

const router = new Router({
    prefix: '/project'
});

/**
 * 查询指定项目
 * @param {number} id 项目ID
 */
router.get('/:id', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await query(ctx.params.id) });
});

/**
 * 创建项目组
 * @param {number} group_id 组ID
 * @param {number} list_id 列表ID
 * @param {string} project_name 项目名称
 * @param {string} project_logo 项目logo
 * @param {string} begin_time 开始时间：2020-06-18
 * @param {number} priority 优先级
 * @param {string} tag 标签
 * @param {string} remark 备注
 * @param {number} pos 位置
 */
router.post('/', async (ctx) => {
    let params = Object.assign({}, ctx.request.body);
    params.create_by = ctx.state.userName;
    ctx.body = ctx.renderJson({ msg: '创建成功', data: await add(params) });
});

/**
 * 删除项目分组，将会把该项目转移到回收站
 * @param {number} id 
 */
router.del('/:id', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '删除成功', data: await del(ctx.params.id) });
});

/**
 * 更新项目列表
 * @param {number} id 项目ID（必要）
 * @param {number} group_id 组ID
 * @param {number} list_id 列表ID
 * @param {string} project_name 项目名称
 * @param {string} project_logo 项目logo
 * @param {string} begin_time 开始时间：2020-06-18
 * @param {number} priority 优先级
 * @param {string} tag 标签
 * @param {string} remark 备注
 * @param {number} pos 位置
 */
router.put('/', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update(ctx.request.body) });
});

export default router;
