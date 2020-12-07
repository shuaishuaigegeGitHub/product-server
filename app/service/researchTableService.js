// 研发列表
import models from "../models/index";
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
import { } from "../util/dingding";

/**
 * 根据状态查询产品
 */
export const findProduct = async (param) => {
    let sql = ` SELECT t1.id,t1.product_name,t2.location,t2.technology_type,t2.priority,t3.strat_up_time*1000 AS strat_up_time,t3.demo_time*1000 AS demo_time,t3.experience_time*1000 AS experience_time,count(t4.id) task_all,t5.num task_complete FROM product t1 LEFT JOIN product_base t2 ON t1.id=t2.product_id LEFT JOIN product_schedule t3 ON t1.id=t3.product_id LEFT JOIN task t4 ON t1.id=t4.product_id LEFT JOIN (
        SELECT COUNT(id) num,product_id FROM task b1 WHERE b1.STATUS=2 GROUP BY b1.product_id) t5 ON t1.id=t5.product_id WHERE t1.status=4 GROUP BY t1.id `;

};
