// 研发列表
import models from "../models/index";
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
import { userMap } from "./UserService";
import { sendOutMessage } from "../util/dingding";

/**
 * 根据状态查询产品
 */
export const findProduct = async (param, headerToken) => {
    if (!param.status) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    let sql = ` SELECT t1.id,t1.product_name,t1.plan_manage_id,t1.project_leader,t1.main_course,t1.master_beauty,t2.location,t2.technology_type,t2.priority,t3.strat_up_time*1000 AS strat_up_time,t3.demo_time*1000 AS demo_time,t3.experience_time*1000 AS experience_time,t3.launch,t3.adopt,count(t4.id) task_all,t5.num task_complete FROM product t1 LEFT JOIN product_base t2 ON t1.id=t2.product_id LEFT JOIN product_schedule t3 ON t1.id=t3.product_id LEFT JOIN task t4 ON t1.id=t4.product_id LEFT JOIN (
        SELECT COUNT(id) num,product_id FROM task b1 WHERE b1.STATUS=2 GROUP BY b1.product_id) t5 ON t1.id=t5.product_id WHERE t1.status=${param.status} GROUP BY t1.id `;
    let [result, users] = await Promise.all([
        models.sequelize.query(sql, { type: models.SELECT }),
        userMap(headerToken)
    ]);
    if (result && result.length) {
        let ids = [];
        result.forEach(item => {
            ids.push(item.id);
            // 策划负责人名称
            item.plan_manage_name = users[item.plan_manage_id] ? users[item.plan_manage_id].username : "";
            // 项目负责人名称
            item.project_leader_name = users[item.project_leader] ? users[item.project_leader].username : "";
            // 主程名称
            item.main_course_name = users[item.main_course] ? users[item.main_course].username : "";
            // 主美名称
            item.master_beauty_name = users[item.master_beauty] ? users[item.main_course].username : "";
        });
        // 查询项目人员
        let psersons = await models.person.findAll({
            where: {
                product_id: { $in: ids }
            }
        });
        let personMap = {};
        // 项目人员数据处理
        psersons.forEach(item => {
            item.username = users[item.user_id] ? users[item.user_id].username : "";
            if (personMap[item.product_id]) {
                if (personMap[item.product_id][item.type]) {
                    personMap[item.product_id][item.type].push(item);
                } else {
                    personMap[item.product_id][item.type] = [item];
                }

            } else {
                personMap[item.product_id] = {};
                personMap[item.product_id][item.type] = [item];
            }
        });
        // 产品人员绑定
        result.forEach(item => {
            let personItem = personMap[item.id] ? personMap[item.id] : {};
            // 美术
            item.painting = personItem[1] ? personItem[1] : [];
            // 程序
            item.program = personItem[2] ? personItem[2] : [];
            // 策划
            item.plan = personItem[3] ? personItem[3] : [];
            // 运营
            item.operate = personItem[4] ? personItem[4] : [];
        });

    }
    return { code: RESULT_SUCCESS, data: result, mmsg: "查询成功" };
};

/**
 * 进入下一阶段
 * @param {*} param 
 */
export const nextStage = async (param) => {
    // 数据效验
    if (!param.id) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    let products = models.sequelize.query(` SELECT t1.status,t2.launch,t2.adopt FROM product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id WHERE t1.id=${param.id} `, { type: models.SELECT });
    if (!products.length) {
        return { code: RESULT_ERROR, msg: "操作错误，产品不存在" };
    }
    let product = products[0];
    if (product.status < 3 || product.status > 7) {
        return { code: RESULT_ERROR, msg: "操作错误，产品阶段不正确" };
    }
    if (product.status == 4 || product.status == 5) {
        if (product.adopt !== 2) {
            return { code: RESULT_ERROR, msg: "操作错误，版本未验收通过" };
        }
    }
    // 更新数据
    await models.sequelize.query(` UPDATE product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id SET t1.status=t1.status+1,t2.launch=1,t2.adopt=1 WHERE t1.id=${param.id} `, { type: models.UPDATE });
    return { code: RESULT_SUCCESS, msg: "操作成功" };

};