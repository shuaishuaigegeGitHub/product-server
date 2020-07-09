import Router from 'koa-router';
import { query, update, del, add, updateTag, updatePos, updatePrincipal, searchRecover, returnToProduct, thoroughdle, updatePosList, followUp, searchProjectMember } from '../service/ProjectService';
import projectLog from '@app/middleware/ProjectLog';

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
router.post('/', projectLog({ describe: '创建了项目：', contentColumnName: 'project_name', action: 'ADD' }), async (ctx) => {
    let params = Object.assign({}, ctx.request.body);
    params.user = ctx.state;
    ctx.body = ctx.renderJson({ msg: '创建成功', data: await add(params) });
});

/**
 * 删除项目分组，将会把该项目转移到回收站
 * @param {number} id 
 */
router.del('/:id', projectLog({ describe: '移动项目到回收站' }), async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '删除成功', data: await del(ctx.params.id) });
});

/**
 * 修改项目名称
 * @param {number} id 项目ID
 * @param {string} project_name 项目名称
 */
router.put('/project-name', projectLog({ describe: '修改项目名称为：', contentColumnName: 'project_name' }), async (ctx) => {
    let { id, project_name } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, project_name, opr_user_id: ctx.state.uid }) });
});

/**
 * 修改项目启动时间
 * @param {number} id 项目ID
 * @param {string} begin_time 启动时间
 */
router.put('/begin-time', projectLog({ describe: '修改项目启动时间为：', contentColumnName: 'begin_time' }), async (ctx) => {
    let { id, begin_time } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, begin_time, opr_user_id: ctx.state.uid }) });
});
/**
 * 修改项目体验版时间
 * @param {number} id 项目ID
 * @param {string} begin_time 启动时间
 */
router.put('/experienceTime', projectLog({ describe: '修改项目体验版时间', contentColumnName: 'experience_time' }), async (ctx) => {
    let { id, experience_time } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, experience_time, opr_user_id: ctx.state.uid }) });
});
/**
 * 修改项目测试版时间
 * @param {number} id 项目ID
 * @param {string} begin_time 启动时间
 */
router.put('/testTime', projectLog({ describe: '修改项目测试版时间', contentColumnName: 'test_time' }), async (ctx) => {
    let { id, test_time } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, test_time, opr_user_id: ctx.state.uid }) });
});
/**
 * 修改项上线时间
 * @param {number} id 项目ID
 * @param {string} begin_time 启动时间
 */
router.put('/onlineTime', projectLog({ describe: '修改项上线时间', contentColumnName: 'online_time' }), async (ctx) => {
    let { id, online_time } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, online_time, opr_user_id: ctx.state.uid }) });
});
/**
 * 修改项目分组
 * @param {number} id 项目ID
 * @param {number} group_id 项目分组ID
 */
router.put('/group', projectLog({ describe: '修改项目分组为：', contentColumnName: 'group' }), async (ctx) => {
    let { id, group_id } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, group_id, opr_user_id: ctx.state.uid }) });
});

/**
 * 修改项目列表
 * @param {number} id 项目ID
 * @param {number} list_id 项目列表ID
 */
router.put('/list', projectLog({ describe: '修改项目列表为：', contentColumnName: 'list' }), async (ctx) => {
    let { id, list_id } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, list_id, opr_user_id: ctx.state.uid }) });
});

/**
 * 修改项目优先级
 * @param {number} id 项目ID
 * @param {number} priority 优先级
 */
router.put('/priority', projectLog({ describe: '修改项目优先级为：', contentColumnName: 'priority' }), async (ctx) => {
    let { id, priority } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, priority, opr_user_id: ctx.state.uid }) });
});

/**
 * 修改项目备注
 * @param {number} id 项目ID
 * @param {string} remark 备注
 */
router.put('/remark', projectLog({ describe: '修改项目备注为：', contentColumnName: 'remark' }), async (ctx) => {
    let { id, remark } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, remark, opr_user_id: ctx.state.uid }) });
});
/**
 * 修改appid
 * @param {number} id 项目ID
 * @param {string} app_id appid
 */
router.put('/updateAppId', projectLog({ describe: '修改appid为：', contentColumnName: 'app_id' }), async (ctx) => {
    let { id, app_id } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await update({ id, app_id, opr_user_id: ctx.state.uid }) });
});


/**
 * 新增项目标签
 * @param {number} id 项目ID
 * @param {string} tag 项目标签
 */
// router.put('/tag/add', projectLog({ describe: '添加标签：', contentColumnName: 'tag' }), async (ctx) => {
//     let { id, tag } = ctx.request.body;
//     ctx.body = ctx.renderJson({ msg: '更新成功', data: await addTag({ id, tag, opr_user_id: ctx.state.uid }) });
// });

/**
 * 删除项目标签
 * @param {number} id 项目ID
 * @param {string} tag 项目标签
 */
// router.put('/tag/del', projectLog({ describe: '删除标签：', contentColumnName: 'tag' }), async (ctx) => {
//     let { id, tag } = ctx.request.body;
//     ctx.body = ctx.renderJson({ msg: '更新成功', data: await delTag({ id, tag, opr_user_id: ctx.state.uid }) });
// });

/**
 * 修改项目标签
 */
router.put('/tag', projectLog({ describe: '修改标签为：', contentColumnName: 'tag' }), async (ctx) => {
    let { id, tag } = ctx.request.body;
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updateTag({ id, tag, opr_user_id: ctx.state.uid }) });
});

/**
 * 修改项目负责人
 * @param {number} id 项目ID
 * @param {number} project_id 项目ID
 * @param {number} user_id 项目用户ID
 * @param {string} username 负责人名字
 * @param {string} avatar 头像
 */
router.put('/principal', projectLog({ describe: '修改项目负责人为：', contentColumnName: 'username', projectIdColumnName: 'project_id' }), async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updatePrincipal(ctx.request.body, ctx.state.uid) });
});

/**
 * 更新项目顺序
 */
router.post('/pos', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updatePos(ctx.request.body) });
});
/**
 * 更新项目顺序和所属任务列表
 */
router.post('/posList', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await updatePosList(ctx.request.body, ctx.state) });
});
/**
 * 查询回收的项目
 */
router.post('/searchRecover', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await searchRecover() });
});
/**
 * 恢复项目
 */
router.post('/returnToProduct', projectLog({ describe: '恢复项目：', contentColumnName: 'group_id,list_id', projectIdColumnName: 'id' }), async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '更新成功', data: await returnToProduct(ctx.request.body) });
});
/**
 * 彻底删除项目
 */
router.post('/thoroughdle', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '删除成功', data: await thoroughdle(ctx.request.body) });
});
/**
 * 项目跟进表
 */
router.post('/followUp', async (ctx) => {
    ctx.body = await followUp(ctx.request.body);
});

export default router;
