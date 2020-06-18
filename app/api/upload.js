import Router from 'koa-router';
import { uploadLogo } from '../service/UploadService';

const router = new Router({
    prefix: '/upload'
});

/**
 * 上传logo
 */
router.post('/logo', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '上传成功', data: await uploadLogo(ctx.request.files.file) });
});

export default router;
