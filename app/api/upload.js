import Router from 'koa-router';
import { uploadLogo } from '../service/UploadService';
import { qiniuUpload } from '../util/qiniu_upload';
import * as responseCode from '../constants/ResponseCode';
import { saveFile, delFile } from '../util/localOperationFile';

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
    const file = ctx.request.files.file;
    file.filePath = file.path;
    file.qiniuFileName = file.name;
    const result = await qiniuUpload(file);
    console.log('fileresult====', result, file);
    const parm = {
        id: file.uid,
        origin_name: file.name,
        url: `${process.env.QINIU_HOST}/${result.key}`,
        size: file.size
    };
    ctx.body = { code: responseCode.RESULT_SUCCESS, msg: '上传成功', data: parm };
});

/**
 * 本地文件保存
 */
router.post('/locatFile', async (ctx) => {
    const file = ctx.request.files.file;
    const result = await saveFile(file);
    if (result.code == responseCode.RESULT_SUCCESS) {
        const parm = {
            id: result.data.id,
            origin_name: file.name,
            url: result.data.path,
            size: file.size
        };
        ctx.body = { code: responseCode.RESULT_SUCCESS, msg: '上传成功', data: parm };
    } else {
        ctx.body = result;
    }
});
/**
 * 本地文件删除
 */
router.post('/locatFileDel', async (ctx) => {
    ctx.body = await delFile(ctx.request.body.url);
});

export default router;
