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
        SELECT COUNT(id) num,product_id FROM task b1 WHERE b1.STATUS=2 GROUP BY b1.product_id) t5 ON t1.id=t5.product_id WHERE t1.status=${param.status} and t1.del=1 GROUP BY t1.id `;
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

/**
 * 发起会议通知
 */
export const noticeOfmeeting = async (param, headerToken) => {
    let transaction = await models.sequelize.transaction();
    try {
        let { product_id, type, meeting_theme, meeting_address, meeting_date, meeting_time, sponsor, host, participants, record } = param;
        if (!product_id || !type || !meeting_theme || !meeting_address || !meeting_date || !meeting_time || !sponsor || !host || !participants || !participants.length || !record) {
            return { code: RESULT_ERROR, msg: "发起会议通知失败，参数错误，请检查参数是否正确填写完整" };
        }
        let [product, users] = await Promise.all([
            models.product.findOne({
                where: {
                    id: product_id
                }
            }),
            userMap(headerToken)
        ]);
        if (!product.webhook || !product.keyword) {
            return { code: RESULT_ERROR, msg: "发起会议通知失败，未配置钉钉消息通知机器人webhook或者钉钉消息通知关键词" };
        }
        let message = `会议主题：${meeting_theme} \n\n 会议地点：${meeting_address}\n\n 会议日期：${meeting_date}\n\n 会议时间：${meeting_time}\n\n 发起人：${users[sponsor] ? users[sponsor].username : ""}\n\n主持人：${users[host] ? users[host].username : ""}\n\n 参与人：`;
        participants.forEach(item => {
            message += users[item] ? users[item].username + "," : ",";
        });
        message += `\n\n 记录人：${users[record] ? users[record].username : ""}`;
        let outResult = await sendOutMessage(product.webhook, message, product.keyword);
        if (outResult.code == RESULT_ERROR) {
            return { code: RESULT_ERROR, msg: "发起会议通知失败，" + outResult.msg };
        }
        // 更新数据库
        // 查询最大版本
        let oldproduct_check = await models.sequelize.query(" select max(version_number) as version_number from product_check where product_id=? and type=? ", { replacements: [product_id, type], type: models.SELECT });
        let version_number = 1;
        if (oldproduct_check && oldproduct_check.length) {
            version_number = oldproduct_check[0].version_number + 1;
        }
        await models.product_check.create({
            product_id, version_number, type, meeting_theme, meeting_address, meeting_date, meeting_time, sponsor, host, participants: participants.join(), record, creade_time: dayjs().unix()
        }, { transaction });
        await models.sequelize.query(` update  product_schedule set launch=2 where product_id=${product_id} `, {
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "发起会议通知成功" };
    } catch (error) {
        console.log("发起会议通知错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "发起会议通知错误" };
    }
};
/**
 * demo版验收表保存
 */
export const demoCheckTableSave = async (param, token) => {
    let { check_id, type, adopt_result, optimization_opinions } = param;
    if (!check_id || !type || !adopt_result || !optimization_opinions) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    // 查询出项目的主程，主美，策划负责人
    let product = await models.sequelize.query("SELECT t1.plan_manage_id,t1.main_course,t1.master_beauty FROM product t1 LEFT JOIN product_check t2 ON t1.id=t2.product_id WHERE t2.id=?", { replacements: [check_id] }, type, models.SELECT);
    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: "参数错误,产品不存在" };
    }
    let menu = false;
    switch (Number(type)) {
        case 1:
            // 程序判断是否是主程
            if (token.uid == product[0].main_course) {
                menu = true;
            }
            break;
        case 2:
            // 策划判读是否是策划负责人
            if (token.uid == product[0].plan_manage_id) {
                menu = true;
            }
            break;
        case 3:
            // 美术判断是否是主美
            if (token.uid == product[0].master_beauty) {
                menu = true;
            }
            break;
    }
    if (!menu) {
        return { code: RESULT_ERROR, msg: "demo版验收表保存失败，不是相关负责人" };
    }
    // 查询表格是否存在，存在就更新，不存在插入
    let table = await models.product_check_detail.count({
        where: {
            master_id: check_id,
            type
        }
    });
    if (table > 0) {
        // 更新
        await models.product_check_detail.update({
            adopt_result: JSON.stringify(adopt_result),
            optimization_opinions: JSON.stringify(optimization_opinions),
        }, {
            where: {
                master_id: check_id,
                type
            }
        });
    } else {
        // 插入
        await models.product_check_detail.create({
            master_id: check_id,
            type,
            user_id: token.uid,
            adopt_result: JSON.stringify(adopt_result),
            optimization_opinions: JSON.stringify(optimization_opinions),
        });
    }
    return { code: RESULT_SUCCESS, msg: "保存成功" };
};