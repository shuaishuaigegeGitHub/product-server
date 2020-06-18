import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// 项目logo上传目录
const PROJECT_LOGO_UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'upload', 'logo');

if (!fs.existsSync(PROJECT_LOGO_UPLOAD_DIR)) {
    fs.mkdirSync(PROJECT_LOGO_UPLOAD_DIR);
}

/**
 * 上传项目logo图片
 * @param {object} file
 * @returns 生成的文件名
 */
export const uploadLogo = (file) => {
    const reader = fs.createReadStream(file.path);
    // 获取后缀
    let originFilename = file.name;
    let ext = originFilename.substr(originFilename.lastIndexOf('.'));
    let filename = uuidv4() + ext;
    let uploadFilePath = path.resolve(PROJECT_LOGO_UPLOAD_DIR, filename);
    const upStream = fs.createWriteStream(uploadFilePath);
    reader.pipe(upStream);
    return filename;
};