// 研发列表
import models from "../models/index";
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from "../util/sqlAppent";
import { userMap } from "./UserService";
import { sendOutMessage } from "../util/dingding";
import { findAllGroup } from "./check_table_messageService";
import { delFile } from "../util/localOperationFile";

/**
 * 根据状态查询产品
 */
export const findProduct = async (param, headerToken) => {
    if (!param.status) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    let sql = ` SELECT t1.id,t1.product_name,t1.plan_manage_id,t1.project_leader,t1.main_course,t1.master_beauty,t2.location,t2.technology_type,t2.priority,t3.strat_up_time*1000 AS strat_up_time,t3.demo_time*1000 AS demo_time,t3.experience_time*1000 AS experience_time,t3.transfer_operation_time*1000 AS transfer_operation_time,t3.extension_time*1000 AS extension_time,t3.launch,t3.adopt,count(t4.id) task_all,t5.num task_complete FROM product t1 LEFT JOIN product_base t2 ON t1.id=t2.product_id LEFT JOIN product_schedule t3 ON t1.id=t3.product_id LEFT JOIN task t4 ON t1.id=t4.product_id LEFT JOIN (
        SELECT COUNT(id) num,product_id FROM task b1 WHERE b1.STATUS=2 GROUP BY b1.product_id) t5 ON t1.id=t5.product_id WHERE t1.status=${param.status} and t1.del=1 GROUP BY t1.id `;
    let [result, users] = await Promise.all([
        models.sequelize.query(sql, { type: models.SELECT }),
        userMap(headerToken),
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
            let rowTime = new Date().getTime();
            // 已耗费天数
            item.cost = parseInt((rowTime - Number(item.strat_up_time)) / 1000 / 60 / 60 / 24);
            // 剩余天数
            item.surplus = parseInt((Number(item.extension_time) - rowTime) / 1000 / 60 / 60 / 24);
            // 进度状态
            item.progress_status = "正常";
            let progress_status = 0;
            switch (Number(param.status)) {
                case 3: ;
                    progress_status = parseInt((Number(item.demo_time) - rowTime) / 1000 / 60 / 60 / 24);
                    break;
                case 4: ;
                    progress_status = parseInt((Number(item.experience_time) - rowTime) / 1000 / 60 / 60 / 24);
                    break;
                case 5: ;
                    progress_status = parseInt((Number(item.transfer_operation_time) - rowTime) / 1000 / 60 / 60 / 24);
                    break;
                case 6: ;
                    progress_status = parseInt((Number(item.extension_time) - rowTime) / 1000 / 60 / 60 / 24);
                    break;
            }
            if (progress_status < 0) {
                item.progress_status = `延期（${progress_status * -1}天）`;
            }
        });
        // 查询logo
        let logos = await models.file.findAll({
            where: {
                product_id: { $in: ids },
                type: 1
            }
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
            // 美术人员
            item.painting = personItem[1] ? personItem[1] : [];
            // 程序人员
            item.program = personItem[2] ? personItem[2] : [];
            // 策划人员
            item.plan = personItem[3] ? personItem[3] : [];
            // 运营人员
            item.operate = personItem[4] ? personItem[4] : [];
            item.logo = {};
            logos.forEach(jt => {
                if (item.id == jt.product_id) {
                    item.logo = jt;
                }
            });
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
    let products = await models.sequelize.query(` SELECT t1.status,t2.launch,t2.adopt FROM product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id WHERE t1.id=${param.id} `, { type: models.SELECT });
    if (!products.length) {
        return { code: RESULT_ERROR, msg: "操作错误，产品不存在" };
    }
    let product = products[0];
    if (product.status < 3 || product.status > 7) {
        return { code: RESULT_ERROR, msg: "操作错误，产品阶段不正确" };
    }
    if (product.status == 4 || product.status == 5) {
        if (product.adopt != 2) {
            return { code: RESULT_ERROR, msg: "操作错误，版本未验收通过" };
        }
    }
    let updatetime = "";
    let time = dayjs().unix();
    // 更新实际版本时间
    switch (Number(product.status)) {
        case 3:
            updatetime = ",t2.actual_demo_time=" + time;//实际demo版日期
            break;
        case 4:
            updatetime = ",t2.actual_experience_time=" + time;//实际体验版日期
            break;
        case 5:
            updatetime = ",t2.actual_transfer_operation=" + time;//实际移交运营日期
            break;
        case 6:
            updatetime = ",t2.actual_extension_time=" + time;//实际正式上线时间
            break;
    }
    console.log("====================================", product);
    // 更新数据
    await models.sequelize.query(` UPDATE product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id SET t1.status=t1.status+1,t2.launch=1,t2.adopt=1 ${updatetime}  WHERE t1.id=${param.id} `, { type: models.UPDATE });
    return { code: RESULT_SUCCESS, msg: "操作成功" };

};

/**
 * 发起会议通知
 */
export const noticeOfmeeting = async (param, headerToken) => {
    let transaction = await models.sequelize.transaction();
    try {
        let { product_id, type, meeting_theme, meeting_address, meeting_date, meeting_time, sponsor, host, participants, record } = param;
        // participants = participants.split(",");
        if (!product_id || !type || !meeting_theme || !meeting_address || !meeting_date || !meeting_time || !sponsor || !host || !participants || !record) {
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
        let check = await models.product_check.create({
            product_id, version_number, type, meeting_theme, meeting_address, meeting_date, meeting_time, sponsor, host, participants: participants.join(), record, creade_time: dayjs().unix()
        }, { transaction });
        check = check.get();
        if (type == 1) {
            // demo版时
            let table = await findAllGroup();
            if (table.code == RESULT_ERROR) {
                await transaction.rollback();
                return table;
            }
            let details = [
                //程序
                {
                    master_id: check.id,
                    type: 1,
                    adopt_result: JSON.stringify(table.data.program)
                },
                //策划
                {
                    master_id: check.id,
                    type: 2,
                    adopt_result: JSON.stringify(table.data.plan)
                }, //美术
                {
                    master_id: check.id,
                    type: 3,
                    adopt_result: JSON.stringify(table.data.painting)
                },
            ];
            await models.product_check_detail.bulkCreate(details, { transaction });
        } else {
            // 体验版时
            await models.product_check_detail.create({
                master_id: check.id,
                type: 0,
                adopt_result: "",
                optimization_opinions: '',
            }, { transaction });

        }
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
    let product = await models.sequelize.query("SELECT t1.plan_manage_id,t1.main_course,t1.master_beauty FROM product t1 LEFT JOIN product_check t2 ON t1.id=t2.product_id WHERE t2.id=?", { replacements: [check_id], type: models.SELECT });
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
    // 更新
    await models.product_check_detail.update({
        user_id: token.uid,
        adopt_result: JSON.stringify(adopt_result),
        optimization_opinions: JSON.stringify(optimization_opinions),
    }, {
        where: {
            master_id: check_id,
            type
        }
    });
    return { code: RESULT_SUCCESS, msg: "保存成功" };
};

/**
 * 添加会议记录
 */
export const taskAddFile = async (param) => {
    await models.file.create({
        check_id: param.check_id,
        type: 9,
        name: param.name,
        url: param.url,
        size: param.size,
        create_time: dayjs().unix()
    });
    return { code: RESULT_SUCCESS, msg: "任务添加附件成功" };
};
/**
 * 删除会议记录
 */
export const taskDelFile = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {
        await models.file.destroy({
            where: {
                url: param.url
            },
            transaction
        });
        delFile(param.url);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "任务删除附件成功" };
    } catch (error) {
        console.log("任务删除附件错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "任务删除附件错误" };
    }

};
/**
 * demo体验报告提交
 */
export const commitReport = async (param) => {
    let transaction = await models.sequelize.transaction();
    try {
        let { check_id, product_id, assessment_results } = param;
        if (!check_id || !product_id || !assessment_results || (assessment_results != 1 && assessment_results != 2)) {
            return { code: RESULT_ERROR, msg: "参数错误" };
        }
        let [launch, adopt, result] = [2, 2, 1];
        if (assessment_results == 2) {
            launch = 1;
            adopt = 1;
            result = 2;
        }
        // 更新产品会议状态
        await models.product_schedule.update({
            launch,
            adopt
        }, {
            where: {
                product_id
            }, transaction
        });
        // 更新验收结果
        await models.product_check.update({
            result
        }, {
            where: {
                id: check_id
            }, transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "提交体检报告成功" };
    } catch (error) {
        console.log("体验报告提交错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "提交体检报告错误" };
    }

};

/**
 * 查询demo版体验报告
 */
export const demoExperienceReport = async (param) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    // 查询数据进行效验
    let product = await models.sequelize.query(`SELECT t3.product_name,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1 LEFT JOIN product t3 on t1.product_id=t3.id LEFT JOIN (
        SELECT version_number number,id,product_id,result,participants FROM product_check WHERE product_id=${param.product_id} AND type=1 AND version_number=(
        SELECT MAX(version_number) FROM product_check WHERE product_id=${param.product_id} AND type=1)) t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id}`, { type: models.SELECT });
    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: "产品不存在" };
    }
    product = product[0];
    if (product.launch != 2) {
        return { code: RESULT_ERROR, msg: "查询错误,未发起会议通知" };
    }
    // 查询验收表详情,会议记录
    let [details, files] = await Promise.all([models.product_check_detail.findAll({
        where: {
            master_id: product.check_id
        },
        raw: true
    }),
    models.file.findAll({
        where: {
            type: 9,
            check_id: product.check_id
        }
    })
    ]);
    let data = {
        product_name: product.product_name,
        product_id: product.product_id,
        check_id: product.check_id,
        assessment_results: product.result || 0, // 评估结果，1通过 2未通过，0未提交
        participants: product.participants ? product.participants.split(",") : []//参会人员
    };

    // 会议记录
    data.files = files;

    // 评分总览数据
    data.overview = {
        allNum: 0,//总分
        totalScore: 0,//总评分
        program: [],//程序
        plan: [],//策划
        painting: []//美术
    };
    // 表格数据处理
    details.forEach(item => {
        if (item.type == 1) {
            data.program = {
                adopt_result: item.adopt_result ? JSON.parse(item.adopt_result) : [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        } else if (item.type == 2) {
            data.plan = {
                adopt_result: item.adopt_result ? JSON.parse(item.adopt_result) : [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        } else if (item.type == 3) {
            data.painting = {
                adopt_result: item.adopt_result ? JSON.parse(item.adopt_result) : [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        }
    });
    //-------------- 评分总览参数处理
    // allNum：总分，totalScore：总得分 
    let allNumMeaage = { check_message: "总分", allNum: 0, num: 0, };
    //程序
    data.program.adopt_result.forEach(item => {
        let num = 0;
        if (item.children && item.children.length) {
            item.children.forEach(jt => {
                allNumMeaage.allNum += Number(jt.num);
                data.overview.allNum += Number(jt.num);
                if (jt.result == 1) {
                    num += Number(jt.num);
                    allNumMeaage.num += Number(jt.num);
                    data.overview.totalScore += Number(jt.num);
                }
            });
        }
        data.overview.program.push({ check_message: item.check_message, num: num });
    });
    data.overview.program.push(allNumMeaage);
    //策划
    allNumMeaage = { check_message: "总分", allNum: 0, num: 0, };
    data.plan.adopt_result.forEach(item => {
        let num = 0;
        if (item.children && item.children.length) {
            item.children.forEach(jt => {
                allNumMeaage.allNum += Number(jt.num);
                data.overview.allNum += Number(jt.num);
                if (jt.result == 1) {
                    num += Number(jt.num);
                    allNumMeaage.num += Number(jt.num);
                    data.overview.totalScore += Number(jt.num);
                }
            });
        }
        data.overview.plan.push({ check_message: item.check_message, num: num });
    });
    data.overview.plan.push(allNumMeaage);
    //美术
    allNumMeaage = { check_message: "总分", allNum: 0, num: 0, };
    data.painting.adopt_result.forEach(item => {
        let num = 0;
        if (item.children && item.children.length) {
            item.children.forEach(jt => {
                allNumMeaage.allNum += Number(jt.num);
                data.overview.allNum += Number(jt.num);
                if (jt.result == 1) {
                    num += Number(jt.num);
                    allNumMeaage.num += Number(jt.num);
                    data.overview.totalScore += Number(jt.num);
                }
            });
        }
        data.overview.painting.push({ check_message: item.check_message, num: num });
    });
    data.overview.painting.push(allNumMeaage);
    return { code: RESULT_SUCCESS, msg: "查询成功", data };
};

/**
 *  体验版验收报告提交
 */
export const experienceCommit = async (param, token) => {
    let { check_id, adopt_result, optimization_opinions, assessment_results, product_id } = param;
    if (!check_id || !adopt_result || !optimization_opinions || !product_id) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    let transaction = await models.sequelize.transaction();
    try {
        let [launch, adopt, result] = [2, 2, 1];
        if (assessment_results == 2) {
            launch = 1;
            adopt = 1;
            result = 2;
        }
        // 更新产品会议状态
        await Promise.all([models.product_schedule.update({
            launch,
            adopt
        }, {
            where: {
                product_id
            }, transaction
        }),
        // 更新验收结果
        models.product_check.update({
            result
        }, {
            where: {
                id: check_id
            }, transaction
        }),
        // 更新验收附表
        models.product_check_detail.update({
            user_id: token.uid,
            adopt_result: JSON.stringify(adopt_result),
            optimization_opinions: JSON.stringify(optimization_opinions),
        }, {
            where: {
                master_id: check_id
            },
            transaction
        })

        ]);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "提交成功" };
    } catch (error) {
        console.log("体验报告提交错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "提交体检报告错误" };
    }

};
/**
 * 体验版验收报告查询
 */
export const findExperienceTable = async (param) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    // 查询数据进行效验
    let product = await models.sequelize.query(`SELECT t3.product_name,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1  LEFT JOIN product t3 on t1.product_id=t3.id LEFT JOIN (
        SELECT version_number number,id,product_id,result,participants FROM product_check WHERE product_id=${param.product_id} AND type=2 AND version_number=(
        SELECT MAX(version_number) FROM product_check WHERE product_id=${param.product_id} AND type=2)) t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id}`, { type: models.SELECT });
    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: "产品不存在" };
    }
    product = product[0];
    if (product.launch != 2) {
        return { code: RESULT_ERROR, msg: "查询错误,未发起会议通知" };
    }
    let detail = await models.product_check_detail.findOne({
        where: {
            master_id: product.check_id
        },
        raw: true
    });
    let data = {
        product_name: product.product_name,
        product_id: product.product_id,
        check_id: product.check_id,
        assessment_results: product.result || 0, // 评估结果，1通过 2未通过，0未提交
        participants: product.participants ? product.participants.split(",") : [],//参会人员
        adopt_result: detail.adopt_result ? JSON.parse(detail.adopt_result) : [],
        optimization_opinions: detail.optimization_opinions ? JSON.parse(detail.optimization_opinions) : [],
    };
    return { code: RESULT_SUCCESS, msg: "查询成功", data };
};

/**
 * 查询验收历史记录
 */
export const findHistory = async (param, headerToken) => {
    let { product_id, type } = param;
    if (!product_id || !type) {
        return { code: RESULT_ERROR, msg: "参数错误" };
    }
    // 
    let [historys, users] = await Promise.all([
        models.product_check.findAll({
            attributes: [],
            where: {
                product_id,
                type
            }
        }),
        userMap(headerToken)
    ]);
    let ids = [];
    historys.forEach(item => {
        ids.push(item.id);
        item.participants = item.participants ? item.participants : "";
        let participants = item.participants.split(",");
        item.participants = "";
        participants.forEach(jt => {
            item.participants += users[jt] ? users[jt].username + "," : "";
        });

    });
    let files = await models.file.findAll({
        where: {
            check_id: { $in: ids },
            type: 9
        }
    });
    historys.forEach(item => {
        files.forEach(jt => {
            if (jt.check_id == item.id) {
                item.file = jt;
                return;
            }
        });
    });
    return { code: RESULT_SUCCESS, data: historys };
};