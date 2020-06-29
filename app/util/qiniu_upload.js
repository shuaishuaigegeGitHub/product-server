/*
 * @Author: lijinxin
 * @Date: 2018-11-26 16:53:27
 * @Email: lijinxin@fenglinghudong.com
 */
const qiniu = require('qiniu');

export const qiniuUpload = async(options) => {
    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const bucket = process.env.QINIU_BUCKET;
    // 生成一个上传的凭证
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // 设置七牛的上传空间
    const putPolicy = new qiniu.rs.PutPolicy({
        scope: bucket
    });
    // 生成上传的Token
    const uploadToken = putPolicy.uploadToken(mac);

    // 实例化config
    const config = new qiniu.conf.Config();

    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    const localFile = options.filePath;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    // 文件上传
    return new Promise((resolved, reject) => {
        formUploader.putFile(uploadToken, options.qiniuFileName, localFile, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                reject(respErr);
            }
            if (respInfo.statusCode === 200) {
                resolved(respBody);
            } else {
                resolved(respBody);
            }
        });
    });
};