// 研发列表
import models from '../models/index';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent, sqlLimit } from '../util/sqlAppent';
import { userMap } from './UserService';
import { sendOutMessage } from '../util/dingding';
import { findAllGroup } from './check_table_messageService';
import { delFile } from '../util/localOperationFile';
import ejsexcel from 'ejsexcel';
import fs from 'fs';
import { isPermission } from './PermissionService';
/**
 * 根据状态查询产品
 */
export const findProduct = async (param, token, headerToken) => {
    console.log('========根据状态查询产品========', param);
    if (!param.status) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    let statusStr = '';
    if (param.status == -1) {
        statusStr = ' t1.status>2 and t1.status<8';
    } else {
        statusStr = ' t1.status=' + param.status;
    }
    if (param.create_time && param.create_time.length > 1) {
        param.create_time[0] = param.create_time[0] / 1000;
        param.create_time[1] = param.create_time[1] / 1000;
    }
    let sql = ` SELECT t1.id,t1.status,t1.product_name,t1.plan_manage_id,t1.provide_id,t1.project_leader,t1.main_course,t1.master_beauty,t1.create_time,t2.location,t2.game_type,t2.pool_id,t2.technology_type,t2.priority,t3.strat_up_time*1000 AS strat_up_time,t3.demo_time*1000 AS demo_time,t3.experience_time*1000 AS experience_time,t3.transfer_operation_time*1000 AS transfer_operation_time,t3.extension_time*1000 AS extension_time,t3.launch,t3.adopt,count(t4.id) task_all,ifnull(t5.num,0) task_complete FROM product t1 LEFT JOIN product_base t2 ON t1.id=t2.product_id LEFT JOIN product_schedule t3 ON t1.id=t3.product_id LEFT JOIN task t4 ON t1.id=t4.product_id 	LEFT JOIN person t6 ON t6.product_id=t1.id LEFT JOIN (
        SELECT COUNT(id) num,product_id FROM task b1 WHERE b1.STATUS=2 GROUP BY b1.product_id) t5 ON t1.id=t5.product_id WHERE  ${statusStr} and t1.del=1 `;
    let object = {
        'location$=': param.location,
        'game_type$=': param.game_type,
        'pool_id$=': param.pool_id,
        'plan_manage_id$=': param.plan_manage_id,
        'provide_id$=': param.provide_id,
        'create_time$b': param.create_time,
        'product_name$l': param.product_name
    },
        sqlMap = {
            location: 't2.location',
            game_type: 't2.game_type',
            pool_id: 't2.pool_id',
            plan_manage_id: 't1.plan_manage_id',
            provide_id: 't1.provide_id',
            create_time: 't1.create_time',
            product_name: 't1.product_name'
        };
    const sqlResult = sqlAppent(object, sqlMap, sql);
    sql += sqlResult.sql;
    // 是否能够拥有查询全部产品权限
    let isPermissionResult = await isPermission(headerToken, '/researchTable/findProductAll');
    if (isPermissionResult.code != 1000) {
        return isPermissionResult;
    }
    if (isPermissionResult.data.isPermission != 1) {
        sql += ` and (t6.user_id=${token.uid} OR t1.input_user_id=${token.uid} OR t1.provide_id=${token.uid} OR t1.plan_manage_id=${token.uid} OR t1.project_leader=${token.uid} OR t1.main_course=${token.uid} OR t1.master_beauty=${token.uid} OR t1.project_approval_id=${token.uid} ) `;
    }
    sql += ' GROUP BY t1.id order by t3.strat_up_time desc';
    const [result, users] = await Promise.all([
        models.sequelize.query(sql, { replacements: sqlResult.param, type: models.SELECT }),
        userMap(headerToken),
    ]);
    if (result && result.length) {
        const ids = [];
        result.forEach(item => {
            ids.push(item.id);
            // 策划负责人名称
            item.plan_manage_name = users[item.plan_manage_id] ? users[item.plan_manage_id].username : '';
            // 项目负责人名称
            item.project_leader_name = users[item.project_leader] ? users[item.project_leader].username : '';
            // 主程名称
            item.main_course_name = users[item.main_course] ? users[item.main_course].username : '';
            // 主美名称
            item.master_beauty_name = users[item.master_beauty] ? users[item.master_beauty].username : '';
            const rowTime = new Date().getTime();
            // 已耗费天数
            if (item.strat_up_time) {
                item.cost = parseInt((rowTime - Number(item.strat_up_time)) / 1000 / 60 / 60 / 24);
            } else {
                item.cost = '未设置时间';
            }

            // 剩余天数
            if (item.extension_time) {
                item.surplus = parseInt((Number(item.extension_time) - rowTime) / 1000 / 60 / 60 / 24);
            } else {
                item.surplus = '未设置时间';
            }

            // 进度状态
            item.progress_status = '正常';
            let progress_status = 0;
            switch (Number(param.status)) {
                case 3:
                    if (item.demo_time) {
                        progress_status = parseInt((Number(item.demo_time) - rowTime) / 1000 / 60 / 60 / 24);
                    } else {
                        item.progress_status = '未设置时间';
                    }
                    break;
                case 4:
                    if (item.experience_time) {
                        progress_status = parseInt((Number(item.experience_time) - rowTime) / 1000 / 60 / 60 / 24);
                    } else {
                        item.progress_status = '未设置时间';
                    }
                    break;
                case 5:
                    if (item.transfer_operation_time) {
                        progress_status = parseInt((Number(item.transfer_operation_time) - rowTime) / 1000 / 60 / 60 / 24);
                    } else {
                        item.progress_status = '未设置时间';
                    }
                    break;
                case 6:
                    if (item.progress_status) {
                        progress_status = parseInt((Number(item.extension_time) - rowTime) / 1000 / 60 / 60 / 24);
                    } else {
                        item.progress_status = '未设置里程碑时间';
                    }
                    break;
            }
            if (progress_status < 0) {
                item.progress_status = `延期（${progress_status * -1}天）`;
            }
        });
        // 查询logo
        const logos = await models.file.findAll({
            where: {
                product_id: { $in: ids },
                type: 1
            }
        });
        // 查询项目人员
        const psersons = await models.person.findAll({
            where: {
                product_id: { $in: ids }
            }
        });
        const personMap = {};
        // 项目人员数据处理
        psersons.forEach(item => {
            item.username = users[item.user_id] ? users[item.user_id].username : '';
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
            const personItem = personMap[item.id] ? personMap[item.id] : {};
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
    return { code: RESULT_SUCCESS, data: result, mmsg: '查询成功' };
};

/**
 * 进入下一阶段
 * @param {*} param
 */
export const nextStage = async (param, token) => {
    console.log('===========进入下一阶段=========', param, token);
    // 数据效验
    if (!param.id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    const products = await models.sequelize.query(` SELECT t1.status,t2.launch,t2.adopt,t1.project_leader FROM product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id WHERE t1.id=${param.id} `, { type: models.SELECT });
    if (!products.length) {
        return { code: RESULT_ERROR, msg: '操作错误，产品不存在' };
    }
    const product = products[0];
    // if (product.project_leader != token.uid) {
    //     return { code: RESULT_ERROR, msg: '不是项目负责人' };
    // }
    if (product.status < 3 || product.status > 7) {
        return { code: RESULT_ERROR, msg: '操作错误，产品阶段不正确' };
    }
    if (product.status == 4 || product.status == 5) {
        if (product.adopt != 2) {
            return { code: RESULT_ERROR, msg: '操作错误，版本未验收通过' };
        }
    }
    let updatetime = '';
    const time = dayjs().unix();
    // 更新实际版本时间
    switch (Number(product.status)) {
        case 3:
            updatetime = `,t2.actual_demo_time=${time}`;// 实际demo版日期
            break;
        case 4:
            updatetime = `,t2.actual_experience_time=${time}`;// 实际体验版日期
            break;
        case 5:
            updatetime = `,t2.actual_transfer_operation=${time}`;// 实际移交运营日期
            break;
        case 6:
            updatetime = `,t2.actual_extension_time=${time}`;// 实际正式上线时间
            break;
    }
    // 更新数据
    await models.sequelize.query(` UPDATE product t1 LEFT JOIN product_schedule t2 ON t1.id=t2.product_id SET t1.status=t1.status+1,t2.launch=1,t2.adopt=1 ${updatetime}  WHERE t1.id=${param.id} `, { type: models.UPDATE });
    return { code: RESULT_SUCCESS, msg: '操作成功' };
};

/**
 * 发起会议通知
 */
export const noticeOfmeeting = async (param, headerToken) => {
    console.log('==============发起会议通知=================', param);
    const { product_id, type, meeting_theme, meeting_address, meeting_date, meeting_time, sponsor, host, participants, record } = param;
    // participants = participants.split(",");
    if (!product_id || !type || !meeting_theme || !meeting_address || !meeting_date || !meeting_time || !sponsor || !host || !participants || !record) {
        return { code: RESULT_ERROR, msg: '发起会议通知失败，参数错误，请检查参数是否正确填写完整' };
    }
    const [product, users] = await Promise.all([
        models.product.findOne({
            where: {
                id: product_id
            }
        }),
        userMap(headerToken)
    ]);
    if (!product.webhook || !product.keyword) {
        return { code: RESULT_ERROR, msg: '发起会议通知失败，未配置钉钉消息通知机器人webhook或者钉钉消息通知关键词' };
    }
    if (type == 1) {
        // demo效验是否配置验收参数
        let check_message = await models.sequelize.query(' SELECT COUNT(id) FROM check_table_message GROUP BY type ', { type: models.SELECT });
        if (check_message.length < 3) {
            return { code: RESULT_ERROR, msg: 'demo验收参数未全部配置' };
        }
        for (let item of check_message) {
            if (item < 1) {
                return { code: RESULT_ERROR, msg: 'demo验收参数未全部配置' };
            }
        }
    }
    const transaction = await models.sequelize.transaction();
    try {


        // 更新数据库
        // 查询最大版本
        const oldproduct_check = await models.sequelize.query(' select max(version_number) as version_number from product_check where product_id=? and type=? ', { replacements: [product_id, type], type: models.SELECT });
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
            // const table = await findAllGroup();
            // if (table.code == RESULT_ERROR) {
            //     await transaction.rollback();
            //     return table;
            // }
            const details = [
                // 程序
                {
                    master_id: check.id,
                    type: 1,
                    // adopt_result: JSON.stringify(table.data.program)
                },
                // 策划
                {
                    master_id: check.id,
                    type: 2,
                    // adopt_result: JSON.stringify(table.data.plan)
                }, // 美术
                {
                    master_id: check.id,
                    type: 3,
                    // adopt_result: JSON.stringify(table.data.painting)
                },
            ];
            await models.product_check_detail.bulkCreate(details, { transaction });
        } else {
            // 体验版时
            await models.product_check_detail.create({
                master_id: check.id,
                type: 0,
                adopt_result: '',
                optimization_opinions: '',
            }, { transaction });
        }
        await models.sequelize.query(` update  product_schedule set launch=2 where product_id=${product_id} `, {
            transaction
        });
        // 发送钉钉消息
        let message = `会议主题：${meeting_theme} \n\n 会议地点：${meeting_address}\n\n 会议日期：${meeting_date}\n\n 会议时间：${meeting_time}\n\n 发起人：${users[sponsor] ? users[sponsor].username : ''}\n\n主持人：${users[host] ? users[host].username : ''}\n\n 参与人：`;
        participants.forEach(item => {
            message += users[item] ? `${users[item].username},` : ',';
        });
        message += `\n\n 记录人：${users[record] ? users[record].username : ''}`;
        const outResult = await sendOutMessage(product.webhook, message, product.keyword);
        if (outResult.code == RESULT_ERROR) {
            await transaction.rollback();
            return { code: RESULT_ERROR, msg: `发起会议通知失败，${outResult.msg}` };
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '发起会议通知成功' };
    } catch (error) {
        console.log('发起会议通知错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '发起会议通知错误' };
    }
};
/**
 * demo版验收表保存
 */
export const demoCheckTableSave = async (param, token) => {
    const { check_id, type, adopt_result, optimization_opinions } = param;
    if (!check_id || !type || !adopt_result || !optimization_opinions) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    if (!adopt_result.length) {
        return { code: RESULT_ERROR, msg: '参数错误,没有验收内容' };
    }
    // 查询出项目的主程，主美，策划负责人
    const product = await models.sequelize.query('SELECT t1.plan_manage_id,t1.main_course,t1.master_beauty FROM product t1 LEFT JOIN product_check t2 ON t1.id=t2.product_id WHERE t2.id=?', { replacements: [check_id], type: models.SELECT });
    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: '参数错误,产品不存在' };
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
        return { code: RESULT_ERROR, msg: 'demo版验收表保存失败，不是相关负责人' };
    }
    // 计算得分
    let total_score = 0;
    let table = [];
    adopt_result.forEach(item => {
        if (item.result == 1) {
            total_score += Number(item.num);
        }
        table.push({
            check_id: check_id,
            type: type,
            message_id: item.id,
            result: item.result
        });
    });
    let transaction = await models.sequelize.transaction();
    if (optimization_opinions && optimization_opinions.length) {
        optimization_opinions.forEach(item => {
            item.username = token.userName;
        });
    }
    try {
        // 更新
        await Promise.all([
            models.product_check_table.destroy({
                where: {
                    check_id: check_id,
                    type: type,
                }, transaction
            }),
            models.product_check_table.bulkCreate(table, { transaction }),
            models.product_check_detail.update({
                user_id: token.uid,
                adopt_result: '',
                optimization_opinions: JSON.stringify(optimization_opinions),
                total_score
            }, {
                where: {
                    master_id: check_id,
                    type
                }, transaction
            })
        ]);

        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '保存成功' };
    } catch (error) {
        console.log('保存验收表错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '保存验收表错误' };
    }


};

/**
 * 添加会议记录
 */
export const taskAddFile = async (param) => {
    console.log('=======添加会议记录========', param);
    await models.file.create({
        product_id: param.product_id,
        check_id: param.check_id,
        type: 9,
        name: param.name,
        url: param.url,
        size: param.size,
        create_time: dayjs().unix()
    });
    return { code: RESULT_SUCCESS, msg: '任务添加附件成功' };
};
/**
 * 删除会议记录
 */
export const taskDelFile = async (param) => {
    console.log('=====删除会议记录=======', param);
    const transaction = await models.sequelize.transaction();
    try {
        await models.file.destroy({
            where: {
                url: param.url
            },
            transaction
        });
        delFile(param.url);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '任务删除附件成功' };
    } catch (error) {
        console.log('任务删除附件错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '任务删除附件错误' };
    }
};
/**
 * demo体验报告提交
 */
export const commitReport = async (param) => {
    const transaction = await models.sequelize.transaction();
    try {
        const { check_id, product_id, assessment_results } = param;
        if (!check_id || !product_id || !assessment_results || (assessment_results != 1 && assessment_results != 2)) {
            return { code: RESULT_ERROR, msg: '参数错误' };
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
            },
            transaction
        });
        // 更新验收结果
        await models.product_check.update({
            result
        }, {
            where: {
                id: check_id
            },
            transaction
        });
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '提交体检报告成功' };
    } catch (error) {
        console.log('体验报告提交错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '提交体检报告错误' };
    }
};

/**
 * 查询demo版体验报告
 */
export const demoExperienceReport = async (param) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    let product = [];
    // 查询数据进行效验
    if (param.check_id) {
        // 有传验收id查找对应的版本
        product = await models.sequelize.query(` SELECT t3.product_name,t3.plan_manage_id,t3.main_course,t3.master_beauty,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1 LEFT JOIN product t3 ON t1.product_id=t3.id LEFT JOIN product_check t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id} AND type=1 AND t2.id=${param.check_id} `, { type: models.SELECT });
    } else {
        // 没传验收id查找最新版本
        product = await models.sequelize.query(`SELECT t3.product_name,t3.plan_manage_id,t3.main_course,t3.master_beauty,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1 LEFT JOIN product t3 on t1.product_id=t3.id LEFT JOIN (
            SELECT version_number number,id,product_id,result,participants FROM product_check WHERE product_id=${param.product_id} AND type=1 AND version_number=(
            SELECT MAX(version_number) FROM product_check WHERE product_id=${param.product_id} AND type=1)) t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id}`, { type: models.SELECT });
    }

    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: '产品不存在或验收表不存在' };
    }
    product = product[0];
    // if (product.launch != 2) {
    //     return { code: RESULT_ERROR, msg: '查询错误,未发起会议通知' };
    // }
    // 查询验收表详情,会议记录,验收信息
    const [details, files, check_message] = await Promise.all([models.product_check_detail.findAll({
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
    }),
    models.sequelize.query(` SELECT t1.*,t3.sort,t3.check_message AS parent_name,IFNULL(t2.result,0) result FROM check_table_message t1 LEFT JOIN (
        SELECT b1.result,b1.message_id FROM product_check_table b1 WHERE b1.check_id=${product.check_id}) t2 ON t1.id=t2.message_id LEFT JOIN check_table_message t3 ON t3.id=t1.parent_id WHERE t1.level =2 ORDER BY t3.sort,t1.sort `
        , { type: models.SELECT }
    )
    ]);
    const data = {
        product_name: product.product_name,
        plan_manage_id: product.plan_manage_id,
        main_course: product.main_course,
        master_beauty: product.master_beauty,
        product_id: product.product_id,
        check_id: product.check_id,
        assessment_results: product.result || 0, // 评估结果，1通过 2未通过，0未提交
        participants: product.participants ? product.participants.split(',') : [],// 参会人员
        files: files // 会议记录
    };
    // --------验收报告数据处理-----

    // 评分总览数据
    data.overview = {
        allNum: 0, // 总分
        totalScore: 0, // 总评分
        program: [], // 程序
        plan: [], // 策划
        painting: []// 美术
    };
    // 表格数据处理
    details.forEach(item => {
        if (item.type == 1) {
            data.program = {
                adopt_result: [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        } else if (item.type == 2) {
            data.plan = {
                adopt_result: [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        } else if (item.type == 3) {
            data.painting = {
                adopt_result: [],
                optimization_opinions: item.optimization_opinions ? JSON.parse(item.optimization_opinions) : []
            };
        }
    });
    // 个个模块的得分{模块id：{allNum:总分，num：得分}}
    let numMap = {};
    let program = { check_message: '总分', allNum: 0, num: 0 }, // 程序
        plan = { check_message: '总分', allNum: 0, num: 0 }, // 策划
        painting = { check_message: '总分', allNum: 0, num: 0 };// 美术
    // 验收信息处理
    check_message.forEach(item => {
        // 计算总分
        data.overview.allNum += Number(item.num);
        // 得分
        let score = 0;
        if (item.result == 1) {
            score = Number(item.num);
            // 计算总评分
            data.overview.totalScore += score;
        }
        switch (Number(item.type)) {
            case 1:
                data.program.adopt_result.push(item);
                // 程序总分
                program.allNum += Number(item.num);
                // 程序总得分
                program.num += score;
                // 模块
                if (numMap[item.parent_id]) {
                    // 总分
                    numMap[item.parent_id].allNum += Number(item.num);
                    // 计算得分
                    numMap[item.parent_id].num += score;
                } else {
                    data.overview.program.push({
                        id: item.parent_id,
                        check_message: item.parent_name,
                        allNum: Number(item.num),
                        num: score
                    });
                    numMap[item.parent_id] = {
                        allNum: Number(item.num),
                        num: score
                    };
                }
                break;
            case 2:
                data.plan.adopt_result.push(item);
                // 策划总分
                plan.allNum += Number(item.num);
                // 策划总得分
                plan.num += score;
                // 模块
                if (numMap[item.parent_id]) {
                    // 总分
                    numMap[item.parent_id].allNum += Number(item.num);
                    // 计算得分
                    numMap[item.parent_id].num += score;
                } else {
                    data.overview.plan.push({
                        id: item.parent_id,
                        check_message: item.parent_name,
                        allNum: Number(item.num),
                        num: score
                    });
                    numMap[item.parent_id] = {
                        allNum: Number(item.num),
                        num: score
                    };
                }

                break;
            case 3:
                data.painting.adopt_result.push(item);
                // 美术总分
                painting.allNum += Number(item.num);
                // 美术总得分
                painting.num += score;
                // 模块
                if (numMap[item.parent_id]) {
                    // 总分
                    numMap[item.parent_id].allNum += Number(item.num);
                    // 计算得分
                    numMap[item.parent_id].num += score;
                } else {
                    data.overview.painting.push({
                        id: item.parent_id,
                        check_message: item.parent_name,
                        allNum: 0,
                        num: 0
                    });
                    numMap[item.parent_id] = {
                        allNum: Number(item.num),
                        num: score
                    };
                }
                break;
            default:
                break;
        }
    });
    // 程序评分赋值
    data.overview.program.forEach(item => {
        item.allNum = numMap[item.id].allNum;
        item.num = numMap[item.id].num;
    });
    data.overview.program.push(program);
    // 策划评分赋值
    data.overview.plan.forEach(item => {
        item.allNum = numMap[item.id].allNum;
        item.num = numMap[item.id].num;
    });
    data.overview.plan.push(plan);
    // 美术评分赋值
    data.overview.painting.forEach(item => {
        item.allNum = numMap[item.id].allNum;
        item.num = numMap[item.id].num;
    });
    data.overview.painting.push(painting);

    console.log('===================================', data.overview);
    return { code: RESULT_SUCCESS, msg: '查询成功', data };
};

/**
 *  体验版验收报告提交
 */
export const experienceCommit = async (param, token) => {
    console.log('========体验版验收报告提交===========', param);
    const { check_id, adopt_result, optimization_opinions, assessment_results, product_id } = param;
    if (!check_id || !adopt_result || !optimization_opinions || !product_id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    if (!assessment_results || (assessment_results != 1 && assessment_results != 2)) {
        return { code: RESULT_ERROR, msg: '请选择评估结果' };
    }
    const transaction = await models.sequelize.transaction();
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
            },
            transaction
        }),
        // 更新验收结果
        models.product_check.update({
            result
        }, {
            where: {
                id: check_id
            },
            transaction
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
        return { code: RESULT_SUCCESS, msg: '提交成功' };
    } catch (error) {
        console.log('体验报告提交错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '提交体检报告错误' };
    }
};
/**
 * 体验版验收报告查询
 */
export const findExperienceTable = async (param) => {
    if (!param.product_id) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    let product = [];
    if (param.check_id) {
        // 有传验收id查找对应的版本
        product = await models.sequelize.query(` SELECT t3.product_name,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1 LEFT JOIN product t3 ON t1.product_id=t3.id LEFT JOIN product_check t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id} AND type=2 AND t2.id=${param.check_id} `, { type: models.SELECT });
    } else {
        //没传验收id查找最新版本
        product = await models.sequelize.query(`SELECT t3.product_name,t1.product_id,t1.launch,t1.adopt,t2.id AS check_id,t2.result,t2.participants FROM product_schedule t1  LEFT JOIN product t3 on t1.product_id=t3.id LEFT JOIN (
        SELECT version_number number,id,product_id,result,participants FROM product_check WHERE product_id=${param.product_id} AND type=2 AND version_number=(
        SELECT MAX(version_number) FROM product_check WHERE product_id=${param.product_id} AND type=2)) t2 ON t2.product_id=t1.product_id WHERE t1.product_id=${param.product_id}`, { type: models.SELECT });
    }

    if (!product || !product.length) {
        return { code: RESULT_ERROR, msg: '产品不存在或验收表不存在' };
    }
    product = product[0];
    // if (product.launch != 2) {
    //     return { code: RESULT_ERROR, msg: '查询错误,未发起会议通知' };
    // }
    const detail = await models.product_check_detail.findOne({
        where: {
            master_id: product.check_id
        },
        raw: true
    });
    const data = {
        product_name: product.product_name,
        product_id: product.product_id,
        check_id: product.check_id,
        assessment_results: product.result || 0, // 评估结果，1通过 2未通过，0未提交
        participants: product.participants ? product.participants.split(',') : [], // 参会人员
        adopt_result: detail.adopt_result ? JSON.parse(detail.adopt_result) : [],
        optimization_opinions: detail.optimization_opinions ? JSON.parse(detail.optimization_opinions) : [],
    };
    return { code: RESULT_SUCCESS, msg: '查询成功', data };
};

/**
 * 查询验收历史记录
 */
export const findHistory = async (param, headerToken) => {
    console.log('========查询验收历史记录============', param);
    const { product_id, type } = param;
    if (!product_id || !type) {
        return { code: RESULT_ERROR, msg: '参数错误' };
    }
    //
    const [historys, users] = await Promise.all([
        models.sequelize.query(` SELECT t1.id,t1.product_id,t1.version_number,t1.type,t1.participants,t1.result,t1.creade_time*1000 as creade_time ,SUM(t2.total_score) AS total_score FROM product_check t1 LEFT JOIN product_check_detail t2 ON t1.id=t2.master_id WHERE t1.product_id=${product_id} AND t1.type=${type} GROUP BY t1.id `, {
            type: models.SELECT
        }),
        userMap(headerToken)
    ]);
    const ids = [];
    historys.forEach(item => {
        ids.push(item.id);
        // 验收人员处理
        item.participants = item.participants ? item.participants : '';
        const participants = item.participants.split(',');
        item.participants = '';
        participants.forEach(jt => {
            item.participants += users[jt] ? `${users[jt].username},` : '';
        });
    });
    const files = await models.file.findAll({
        where: {
            check_id: { $in: ids },
            type: 9
        }
    });
    historys.forEach(item => {
        files.forEach(jt => {
            if (jt.check_id == item.id) {
                item.file = jt;
            }
        });
    });
    return { code: RESULT_SUCCESS, data: historys };
};
/**
 *化意见导出
 */
export const demoOutXlsx = async (param) => {
    if (!param.check_id) {
        return { code: RESULT_ERROR, msg: '导出失败，参数错误' };
    }
    let checkData = await models.sequelize.query(` SELECT t1.*,t3.product_name FROM product_check_detail t1 LEFT JOIN product_check t2 ON t2.id=t1.master_id LEFT JOIN  product t3 ON t3.id=t2.product_id WHERE  t2.id=${param.check_id} `, { type: models.SELECT });
    let data = {
        product_name: '',
        list: []
    };
    if (checkData && checkData.length) {
        data.product_name = checkData[0].product_name;
        checkData.forEach(item => {
            if (item.optimization_opinions && item.optimization_opinions.length) {
                let optimization_opinions = JSON.parse(item.optimization_opinions);
                if (optimization_opinions && optimization_opinions.length) {
                    data.list.push(...optimization_opinions);
                }
            }
        });
    }
    const templateBuffer = fs.readFileSync(__dirname + '/../template/demoTemplate.xlsx');
    // 渲染数据生成文件流
    const excelBuffer = await ejsexcel.renderExcel(templateBuffer, data);
    return excelBuffer;
};

