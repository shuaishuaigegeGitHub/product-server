// 调用钉钉接口

import axios from "axios";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
/**
 * 调用钉钉接口发送消息
 * @param {string} url  消息发送路径
 * @param {string} message  发送的消息信息
 * @param {string} keyword  发送的消息关键字
 */
export const sendOutMessage = (webhook, message, keyword) => {
    return new Promise((resolve, reject) => {
        let markdown = {
            "msgtype": "markdown",
            "markdown": {
                "title": keyword,
                "text": message
            },
            "at": {
                "atMobiles": [
                ],
                "isAtAll": false
            }
        };
        axios.post(webhook, markdown, { timeout: 1000 * 10 }).then(res => {
            let responseData = res.data;
            if (responseData.errcode) {
                let msg = "钉钉发送信息失败";
                if (responseData.errcode == 310000) {
                    msg += ",通知关键词配置错误";
                }
                resolve({ code: RESULT_ERROR, msg });
                return;
            }
            resolve({ code: RESULT_SUCCESS, msg: "发送信息成功" });
        }).catch(error => {
            console.log("钉钉消息发送请求超时", error);
            resolve({ code: RESULT_ERROR, msg: "钉钉消息发送请求超时,请检查消息通知key是否正确，或者重试" });
        });
    });


};