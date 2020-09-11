import models from '../models';

import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE, RESULT_SUCCESS } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
/**
 * 文件列表
 */
export const fileList = async (param) => {
    let sql = ` SELECT t1.*  FROM file t1   `;
    let sqlTotal = ` SELECT count(1) num FROM file t1  `;
    let object = {
        "id$=": param.id,
        "create_name$l": param.create_name,
        "remark$l": param.remark,
        "project_id$=": param.project_id
    },
        sqlMap = {
            "id": "t1.id",
            "create_name": "t1.create_name",
            "remark": "t1.remark",
            "project_id": "t1.project_id"
        };
    let sqlResult = sqlAppent(object, sqlMap, sql);
    sql += sqlResult.sql;
    sqlTotal += sqlResult.sql;
    sql += " order by t1.create_time desc ";
    sql += sqlLimit(param.page, param.pageSize);
    let data = await models.sequelize.query(sql, { replacements: sqlResult.param, type: models.Sequelize.QueryTypes.SELECT });
    let total = await models.sequelize.query(sqlTotal, { replacements: sqlResult.param, type: models.Sequelize.QueryTypes.SELECT });
    return { code: RESULT_SUCCESS, data: data, total: total[0].num };

};
/**
 * 保存文件
 * @param {*} param 
 */
export const saveFile = async (param, token) => {
    // 保存文件
    if (param.fileList && param.fileList.length > 0) {
        let rowDate = parseInt(new Date().getTime() / 1000);
        let datas = [];
        let sql = ` INSERT INTO file (project_id,origin_name,url,size,create_by,create_name ,create_time,remark) VALUES  `;
        param.fileList.forEach(item => {
            sql += "(?,?,?,?,?,?,?,?),";
            datas.push(
                param.project_id,
                item.origin_name,
                item.url,
                item.size,
                token.uid,
                token.userName,
                rowDate,
                param.remark
            );

        });
        sql = sql.substring(0, sql.length - 1);
        console.log(datas);
        await models.sequelize.query(sql, { replacements: datas, type: models.Sequelize.QueryTypes.INSERT });
        return { code: RESULT_SUCCESS, msg: "保存成功" };

    }
    return { code: INVALID_PARAM_ERROR_CODE, msg: "参数错误" };
};
/**
 * 删除文件
 * @param {*} param 
 */
export const deleteFile = async (param) => {
    await models.file.destroy({
        where: {
            id: param.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除成功" };
};
