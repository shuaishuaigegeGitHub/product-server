import models from '../models';
import dayjs from 'dayjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sendOutMessage } from '../util/dingding';
import { delFile } from '../util/localOperationFile';
import log from '@config/log';
import sequelize, { QueryTypes } from 'sequelize';
import { multiply } from 'lodash';

export const saveConclusion = async param => {
    const time = dayjs().unix();
    const transaction = await models.sequelize.transaction();
    try {
        const conclusion = await models.product_conclusion.findOne({
            where: {
                product_id: param.product_id
            }
        });
        if (conclusion === null) {
            // 保存总结表
            await models.product_conclusion.create(
                {
                    product_id: param.product_id,
                    seven_days_data: JSON.stringify(param.seven_days_data),
                    product_result: param.product_result,
                    market_feedback: param.market_feedback,
                    demo_status: JSON.stringify(param.demo_status),
                    experience_status: JSON.stringify(param.experience_status),
                    transfer_operation_status: JSON.stringify(
                        param.paramtransfer_operation_status
                    ),
                    question_feedback: JSON.stringify(param.question_feedback),
                    // result_show: JSON.stringify(param.result_show),
                    new_breakthrough: param.new_breakthrough,
                    reflection_conclusion: param.reflection_conclusion,
                    product_extension: param.product_extension,
                    // product_meeting: JSON.stringify(param.product_meeting),
                    program_code: JSON.stringify(param.program_code),
                    behind_upload: JSON.stringify(param.behind_upload),
                    art_upload: JSON.stringify(param.art_upload)
                },
                { transaction }
            );
            // 总结文件保存
            if (param.conclusionFiles && param.conclusionFiles.length) {
                const files = [];
                param.conclusionFiles.forEach(item => {
                    files.push({
                        product_id: param.product_id,
                        type: item.type,
                        name: item.name,
                        url: item.url,
                        size: item.size,
                        create_time: time
                    });
                });
                await models.file.bulkCreate(files, { transaction });
            }
        } else {
            // 更新总结表
            await models.product_conclusion.update(
                {
                    product_id: param.product_id,
                    seven_days_data: JSON.stringify(param.seven_days_data),
                    product_result: param.product_result,
                    market_feedback: param.market_feedback,
                    demo_status: JSON.stringify(param.demo_status),
                    experience_status: JSON.stringify(param.experience_status),
                    transfer_operation_status: JSON.stringify(
                        param.paramtransfer_operation_status
                    ),
                    question_feedback: JSON.stringify(param.question_feedback),
                    // result_show: JSON.stringify(param.result_show),
                    new_breakthrough: param.new_breakthrough,
                    reflection_conclusion: param.reflection_conclusion,
                    product_extension: param.product_extension,
                    // product_meeting: JSON.stringify(param.product_meeting),
                    program_code: JSON.stringify(param.program_code),
                    behind_upload: JSON.stringify(param.behind_upload),
                    art_upload: JSON.stringify(param.art_upload)
                },
                {
                    where: {
                        product_id: param.product_id
                    },
                    transaction
                }
            );

            // 增加文件文件
            if (param.addFiels && param.addFiels.length) {
                const fiels = [];
                param.addFiels.forEach(item => {
                    fiels.push({
                        product_id: param.product_id,
                        type: item.type,
                        name: item.name,
                        url: item.url,
                        size: item.size,
                        create_time: time
                    });
                });
                await models.file.bulkCreate(fiels, transaction);
            }

            // 删除文件
            if (param.delFIles && param.delFIles.length) {
                const ids = [];
                param.delFIles.forEach(item => {
                    delFile(item.url);
                    ids.push(item.id);
                });
                await models.file.destroy({
                    where: {
                        id: { $in: ids }
                    },
                    transaction
                });
            }
        }
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '保存成功' };
    } catch (error) {
        console.log('总结保存错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '总结保存错误' };
    }
};

export const archiveConclusion = async param => {
    const transaction = await models.sequelize.transaction();
    try {
        await models.product.update(
            {
                status: 9
            },
            {
                where: {
                    id: param.product_id
                }
            },
            { transaction }
        );
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: '归档成功' };
    } catch (error) {
        console.log('总结归档错误', error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: '总结归档错误' };
    }
};

export const meetingNotice = async param => {
    const result = await models.product.findByPk(param.product_id, {
        attributes: ['webhook', 'keyword']
    });

    if (!result.webhook || !result.keyword) {
        return {
            code: RESULT_ERROR,
            msg:
                '发起会议通知失败，未配置钉钉消息通知机器人webhook或者钉钉消息通知关键词'
        };
    }

    let message = `会议主题：${param.meeting_theme} \n\n 会议地点：${param.meeting_address}\n\n 会议日期：${param.meeting_date}\n\n 会议时间：${param.meeting_time}\n\n 发起人：${param.originator}\n\n 主持人：${param.host}\n\n 参与人：`;
    param.participants.forEach(item => {
        message += `${[item]},`;
    });

    const sendResult = await sendOutMessage(
        result.webhook,
        message,
        result.keyword
    );
    if (sendResult.code == RESULT_ERROR) {
        return {
            code: RESULT_ERROR,
            msg: `发起会议通知失败，${sendResult.msg}`
        };
    }
};

export const getConclusion = async param => {
    const {
        page = 1,
        size = 10,
        research_status,
        product_result,
        product_name,
        status
    } = param;
    const offset = (page - 1) * size;
    try {
        let sql = `
        SELECT * from (
        SELECT 
            d.id product_id,
            d.product_name,
            d.actual_demo_time*1000 actual_demo_time,
            d.actual_experience_time*1000 actual_experience_time,
            d.actual_transfer_operation*1000 actual_transfer_operation,
            d.actual_extension_time*1000 actual_extension_time,
            d.research_status,
            (CASE e.product_result WHEN '1' THEN '成功' WHEN '2' THEN '失败' END )product_result,
            (CASE d.status WHEN '9' THEN '已归档' ELSE '未归档' END )status,
            (CASE JSON_EXTRACT(e.art_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)art,
            (CASE JSON_EXTRACT(e.behind_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)behind,
            (CASE JSON_EXTRACT(e.program_code,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)program,
            e.market_feedback,
            d.project_approval_time*1000 roject_approval_time,
            d.strat_up_time*1000 strat_up_time,
            d.program_intervention_time*1000 program_intervention_time,
            d.demo_time*1000 demo_time,
            d.experience_time*1000 experience_time,
            d.transfer_operation_time*1000 transfer_operation_time,
            e.demo_status,
            e.experience_status,
            e.transfer_operation_status,
            e.question_feedback,
            e.new_breakthrough,
            e.reflection_conclusion,
            e.product_extension,
            e.program_code,
            e.behind_upload,
            e.art_upload
       FROM 
     (SELECT 
            a.product_name,
			a.id,
			a.status,
		    b.actual_demo_time,
		    b.actual_experience_time,
	        b.actual_transfer_operation,
            b.actual_extension_time,
			b.project_approval_time,
			b.strat_up_time,
			b.program_intervention_time,
			b.demo_time,
			b.experience_time,
			b.transfer_operation_time,
		  (CASE WHEN b.extension_time >b.actual_extension_time THEN '提前' WHEN b.extension_time = b.actual_extension_time THEN '正常' ELSE '延期' END) research_status
	    FROM product a 
		LEFT JOIN 
			product_schedule b 
		ON a.id = b.product_id
		WHERE a.status IN(8,9)
			                ) d
			
		LEFT JOIN 
			product_conclusion e
        ON d.id = e.product_id
        )f
			WHERE 1= 1
           `;
        let count = `
    SELECT count(*) as total FROM (
        SELECT 
            d.id,
            d.product_name,
            d.actual_demo_time,
            d.actual_experience_time,
            d.actual_transfer_operation,
            d.actual_extension_time,
            d.research_status,
            (CASE e.product_result WHEN '1' THEN '成功' WHEN '2' THEN '失败' END )product_result,
            (CASE d.status WHEN '9' THEN '已归档' ELSE '未归档' END )status,
            (CASE JSON_EXTRACT(e.art_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)art,
            (CASE JSON_EXTRACT(e.behind_upload,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)behind,
            (CASE JSON_EXTRACT(e.program_code,'$.whether_commit') WHEN '1' THEN '提交' WHEN '2' THEN '未提交' END)program,
            e.market_feedback,
            d.project_approval_time,
            d.strat_up_time,
            d.program_intervention_time,
            d.demo_time,
            d.experience_time,
            d.transfer_operation_time,
            e.demo_status,
            e.experience_status,
            e.transfer_operation_status,
            e.question_feedback,
            e.new_breakthrough,
            e.reflection_conclusion,
            e.product_extension,
            e.program_code,
            e.behind_upload,
            e.art_upload
            FROM 
             (SELECT 
                  a.product_name,
                        a.id,
                        a.status,
                      b.actual_demo_time,
                      b.actual_experience_time,
                    b.actual_transfer_operation,
                  b.actual_extension_time,
                        b.project_approval_time,
                        b.strat_up_time,
                        b.program_intervention_time,
                        b.demo_time,
                        b.experience_time,
                        b.transfer_operation_time,
                      (CASE WHEN b.extension_time >b.actual_extension_time THEN '提前' WHEN b.extension_time = b.actual_extension_time THEN '正常' ELSE '延期' END) research_status
                        FROM product a 
                        LEFT JOIN 
                        product_schedule b 
                        ON a.id = b.product_id
                        WHERE a.status IN(8,9)
                        ) d
                        
                        LEFT JOIN 
                        product_conclusion e
                        ON d.id = e.product_id
                                               ) f
                         where 1=1            
           `;
        if (research_status) {
            sql += `AND f.research_status = '${research_status}'`;
        }
        if (product_result) {
            sql += `AND f.product_result = '${product_result}'`;
        }
        if (product_name) {
            sql += `AND f.product_name = '${product_name}'`;
        }
        if (status) {
            sql += `AND f.status = '${status}'`;
        }
        sql += `limit ${offset}, ${size}`;
        const result = await models.sequelize.query(sql, {
            type: models.sequelize.QueryTypes.SELECT
        });
        if (result != null && result.length > 0) {
            result.forEach(item => {
                item.demo_status = JSON.parse(item.demo_status);
                item.experience_status = JSON.parse(item.experience_status);
                item.program_code = JSON.parse(item.program_code);
                item.behind_upload = JSON.parse(item.behind_upload);
                item.art_upload = JSON.parse(item.art_upload);
                item.question_feedback = JSON.parse(item.question_feedback);
            });
        }
        console.log('result8888888', result);
        const countResult = await models.sequelize.query(count, {
            type: models.sequelize.QueryTypes.SELECT,
            plain: true
        });
        return {
            code: RESULT_SUCCESS,
            data: result,
            total: countResult.total,
            msg: '查询成功'
        };
    } catch (error) {
        console.log('总结分页查询错误', error);
        return { code: RESULT_ERROR, msg: '总结分页查询错误' };
    }
};

export const getFiles = async param => {
    const files = await models.file.findAll({
        where: { product_id: param.product_id }
    });
    console.log('11111files:', files);
    return { code: RESULT_SUCCESS, data: files, msg: '查询成功' };
};
