// 本地文件操作
import fs from 'fs';
import * as UUID from 'uuid';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';


/**
 * 本地文件保存
 * @param {文件实例} file
 */
export const saveFile = async (file) => {
    // 配置的本地文件保存路径
    let mkdirPath = process.env.FILE_SAVE_PATH;
    if (!mkdirPath || !mkdirPath.length) {
        return { code: RESULT_ERROR, msg: '未配置本地文件保存路径' };
    }
    if (!fs.existsSync(mkdirPath)) {
        return { code: RESULT_ERROR, msg: '保存文件文件夹不存在。配置文件夹路径', mkdirPath };
    }
    mkdirPath += '/file';
    if (!fs.existsSync(mkdirPath)) {
        const mdkir = fs.mkdirSync(mkdirPath);
    }
    const name = file.name.split('.');
    const id = UUID.v1();
    // 保存在本地的文件名称使用uuid防止重复
    const fileName = `/${id}.${name[name.length - 1]}`;
    const writePath = mkdirPath + fileName;
    const path = `${process.env.FILE_HTTP_ADDRESS}/file${fileName}`;
    // 读取文件
    const fileBuffer = fs.readFileSync(file.path);
    // 书写文件
    fs.writeFileSync(writePath, fileBuffer);
    return { code: RESULT_SUCCESS, msg: '保存文件成功', data: { id, name: file.name, size: file.size, path } };
};
/**
 * 本地文件删除
 * @param {http开头的文件地址路径} httPath
 */
export const delFile = (httPath) => {
    const paths = httPath.split('/');
    const path = `${process.env.FILE_SAVE_PATH}/file/${paths[paths.length - 1]}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

    return { code: RESULT_SUCCESS, msg: '删除文件成功' };
};

