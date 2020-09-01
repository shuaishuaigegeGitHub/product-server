import Router from 'koa-router';
import { uploadLogo } from '../service/UploadService';
import { qiniuUpload } from "../util/qiniu_upload";
import models from '../models';
import * as responseCode from "../constants/ResponseCode";

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
    let file = ctx.request.files.file;
    let token = ctx.state;
    file.filePath = file.path;
    file.qiniuFileName = file.name;
    let result = await qiniuUpload(file);
    console.log("fileresult====", result, file);
    let parm = {
        id: file.uid,
        origin_name: file.name,
        url: process.env.QINIU_HOST + "/" + result.key,
        size: file.size
    };
    ctx.body = { code: responseCode.RESULT_SUCCESS, msg: '上传成功', data: parm };
});

export default router;
