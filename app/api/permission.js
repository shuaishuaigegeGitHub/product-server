'use strict';

import Router from 'koa-router';
import { getMenu, getSystem, changeLoginStatus } from '../service/PermissionService';

const router = new Router({
    prefix: '/permission'
});

/**
 * 获取权限列表
 */
router.get('/menu', async (ctx, next) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await getMenu(ctx.header.token) });
});

/**
 * 获取其他系统信息
 */
router.get('/system', async (ctx, next) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: await getSystem(ctx.header.token) });
});

/**
 * 获取当前用户信息
 */
router.get('/userinfo', async (ctx, next) => {
    ctx.body = ctx.renderJson({ msg: '查询成功', data: ctx.state });
});

/**
 * 更新用户首次登陆状态
 */
router.post('/changeLoginStatus', async (ctx) => {
    changeLoginStatus(ctx.header.token);
    ctx.body = ctx.renderJson({ msg: '修改成功' });
});


export default router;