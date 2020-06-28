import Router from 'koa-router';
import { uploadLogo } from '../service/UploadService';

// import QiniuUpload from 'QiniuUpload';
// import path from 'path';

const router = new Router({
    prefix: '/upload'
});

/**
 * 上传logo
 */
router.post('/logo', async (ctx) => {
    ctx.body = ctx.renderJson({ msg: '上传成功', data: await uploadLogo(ctx.request.files.file) });
});
/**
 * 上传文件
 */
router.post('/file', async (ctx) => {
    console.log(ctx.request.files);
    let file = ctx.request.files.file;

    ctx.body = { msg: '上传成功', data: "rgsrsesgreheyge" };
});

export default router;
