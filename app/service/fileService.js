import models from '../models';

import { INVALID_PARAM_ERROR_CODE, DB_ERROR_CODE, RESULT_SUCCESS } from '@app/constants/ResponseCode';
import dayjs from 'dayjs';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
/**
 * 文件列表
 */
export const fileList = async (param) => {
    let sql = ` SELECT t1.*,t2.task_name task_name,t3.type_name,t2.task_username  FROM file t1 LEFT JOIN task t2 ON t1.task_id=t2.id LEFT JOIN task_type t3 ON t3.id=t2.task_type  `;
    let sqlTotal = ` SELECT count(1) num FROM file t1 LEFT JOIN task t2 ON t1.task_id=t2.id LEFT JOIN task_type t3 ON t3.id=t2.task_type `;
    let object = {
        "id$=": param.id,
        "task_id$=": param.task_id,
        "task_type$=": param.task_type,
        "task_name$l": param.task_name,
        "task_username$l": param.task_username,
        "project_id$=": param.project_id
    },
        sqlMap = {
            "id": "t1.id",
            "task_id": "t1.task_id",
            "task_type": "t1.task_type",
            "task_name": "t2.task_name",
            "task_username": "t2.task_username",
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
