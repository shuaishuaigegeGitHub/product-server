import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import {sendOutMessage} from '../util/dingding';
import log from '@config/log';
import sequelize, { QueryTypes } from 'sequelize';

export const saveConclusion = async (param) => {
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    try {
        // 保存总结表
        await models.product_conclusion.create({
            product_id: param.product_id,
            seven_days_data: JSON.stringify(param.seven_days_data),
            product_result: param.product_result,
            market_feedback: param.market_feedback,
            demo_status: JSON.stringify(param.demo_status),
            experience_status: JSON.stringify(param.experience_status),
            transfer_operation_status: JSON.stringify(param.paramtransfer_operation_status),
            question_feedback: JSON.stringify(param.question_feedback),
            result_show: JSON.stringify(param.result_show),
            new_breakthrough: param.new_breakthrough,
            reflection_conclusion: param.reflection_conclusion,
            product_extension: param.product_extension,
            product_meeting: JSON.stringify(param.product_meeting),
            program_code: JSON.stringify(param.program_code),
            behind_upload: JSON.stringify(param.behind_upload),
            art_upload: JSON.stringify(param.art_upload),
        }, {transaction});
        // 保存product_schedule表
        await models.product_schedule.create({
            product_id: param.product_id,
            project_approval_time: param.project_approval_time,
            strat_up_time: param.strat_up_time,
            program_intervention_time: param.program_intervention_time,
            demo_time: param.demo_time,
            experience_time: param.experience_time,
            transfer_operation_time: param.transfer_operation_time,
            actual_demo_time: param.actual_demo_time,
            actual_experience_time: param.actual_experience_time,
            actual_transfer_operation: param.actual_transfer_operation,
            actual_extension_time: param.actual_extension_time
        }, {transaction});
        // 总结文件保存
        if (param.conclusionFiles && param.conclusionFiles.length) {
            const files = [];
            param.conclusionFiles.forEach(item => {
                files.push({
                    product_id: param.id,
                    type: item.type,
                    name: item.name,
                    url: item.url,
                    size: item.size,
                    create_time: time
                });
            });
            await models.file.bulkCreate(files, {transaction});
        }
        await transaction.commit();
        return {code: RESULT_SUCCESS, msg: '保存成功'};
    } catch (error) {
        console.log('总结保存错误', error);
        await transaction.rollback();
        return {code: RESULT_ERROR, msg: '总结保存错误'};
    }
};

export const archiveConclusion = async(param) => {
    const transaction = await models.sequelize.transaction();
    try {
        await models.product.update({
            status: 9
        }, {
            where: {
                id: param.product_id
            },
        }, {transaction});
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '归档成功' };
    } catch (error) {
        console.log('总结归档错误', error);
        await transaction.rollback();
        return {code: RESULT_ERROR, msg: '总结归档错误'};
    }
};


export const meetingNotice = async(param) => {
    const result = await models.product.findByPk(param.product_id, {
        attributes: ['webhook', 'keyword']
    },);

    if (!result.webhook || !result.keyword) {
        return { code: RESULT_ERROR, msg: '发起会议通知失败，未配置钉钉消息通知机器人webhook或者钉钉消息通知关键词' };
    }

    let message = `会议主题：${param.meeting_theme} \n\n 会议地点：${param.meeting_address}\n\n 会议日期：${param.meeting_date}\n\n 会议时间：${param.meeting_time}\n\n 发起人：${param.originator}\n\n 主持人：${param.host}\n\n 参与人：`;
    param.participants.forEach(item => {
        message += `${[item]},`;
    });

    const sendResult = await sendOutMessage(result.webhook, message, result.keyword);
    if (sendResult.code == RESULT_ERROR) {
        return { code: RESULT_ERROR, msg: `发起会议通知失败，${outResult.msg}` };
    }
};

export const getConclusion = async(param) => {
    const { page = 1, size = 10 } = param;
    const offset = (page - 1) * size;
    try {
        const sql = `SELECT * FROM (
    SELECT c.product_id,
    c.status,
    c.art_upload,
    c.product_result,
    c.behind_upload,
    c.program_code,
    c.product_name,
    d.actual_demo_time,
    d.actual_experience_time,
    d.actual_transfer_operation,
    d.actual_extension_time,
    (CASE WHEN d.extension_time >d.actual_extension_time THEN '提前' WHEN d.extension_time = d.actual_extension_time THEN '正常' ELSE '延期' END) research_status
    FROM (SELECT b.product_name,(CASE b.status WHEN '9' THEN '已归档' ELSE '未归档' END )status,
    (CASE a.product_result WHEN '1' THEN '成功' WHEN '2' THEN '失败' END )product_result,
    (CASE JSON_EXTRACT(a.art_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)art_upload,
    (CASE JSON_EXTRACT(a.behind_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)behind_upload,
    (CASE JSON_EXTRACT(a.program_code,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)program_code,
    a.product_id
     FROM product_conclusion a 
     LEFT JOIN product b 
     ON a.product_id=b.id
     WHERE a.product_result= ?
     AND b.product_name= ?
     ) c 
    LEFT JOIN product_schedule d 
    ON c.product_id=d.product_id
    ) e
    where e.research_status = ?
    AND e.status = ? 
    limit ?, ? `;
        const result = await models.sequelize.query(sql, {
            replacements: [param.product_result, param.product_name, param.research_status, param.status, offset, size],
            type: QueryTypes.SELECT,
        });
        return {code: RESULT_SUCCESS, data: result, msg: '查询成功'};
    } catch (error) {
        console.log('总结分页查询错误', error);
        return {code: RESULT_ERROR, msg: '总结分页查询错误'};
    }
};