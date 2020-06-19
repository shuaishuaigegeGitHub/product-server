import Router from 'koa-router';
import { query, update, del, add, addTag, delTag, updatePos } from '../service/ProjectService';

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
    params.user = ctx.state;
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

/**
 * 修改项目名称
 * @param {number} id 项目ID
 * @param {string} project_name 项目名称
 */
router.put('/project-name', async (ctx) => {
    let { id, project_name } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, project_name }) });
});

/**
 * 修改项目启动时间
 * @param {number} id 项目ID
 * @param {string} begin_time 启动时间
 */
router.put('/begin-time', async (ctx) => {
    let { id, begin_time } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, begin_time }) });
});

/**
 * 修改项目分组
 * @param {number} id 项目ID
 * @param {number} group_id 项目分组ID
 */
router.put('/group', async (ctx) => {
    let { id, group_id } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, group_id }) });
});

/**
 * 修改项目列表
 * @param {number} id 项目ID
 * @param {number} list_id 项目列表ID
 */
router.put('/list', async (ctx) => {
    let { id, list_id } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, list_id }) });
});

/**
 * 修改项目优先级
 * @param {number} id 项目ID
 * @param {number} priority 优先级
 */
router.put('/priority', async (ctx) => {
    let { id, priority } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, priority }) });
});

/**
 * 修改项目备注
 * @param {number} id 项目ID
 * @param {string} remark 备注
 */
router.put('/remark', async (ctx) => {
    let { id, remark } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, remark }) });
});

/**
 * 新增项目标签
 * @param {number} id 项目ID
 * @param {string} tag 项目标签
 */
router.put('/tag/add', async (ctx) => {
    let { id, tag } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await addTag({ id, tag }) });
});

/**
 * 删除项目标签
 * @param {number} id 项目ID
 * @param {string} tag 项目标签
 */
router.put('/tag/del', async (ctx) => {
    let { id, tag } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await delTag({ id, tag }) });
});


/**
 * 修改项目负责人
 * @param {number} id 项目ID
 * @param {number} project_id 项目ID
 * @param {number} user_id 项目用户ID
 * @param {string} username 负责人名字
 * @param {string} avatar 头像
 */
// router.put('/principal', async (ctx) => {
//     let { id, project_id, user_id, username, avatar } = ctx.request.body;
//     ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, project_id, user_id, username, avatar }) });
// });

/**
 * 更新项目顺序
 */
router.post('/pos', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updatePos(ctx.request.body) });
});

export default router;
