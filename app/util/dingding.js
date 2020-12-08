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
    // webhook = "https://oapi.dingtalk.com/robot/send?access_token=ca182864177c4136e7bb08cd4bf937c7bde02fd5bb4c84756b4281c8c6df7914";

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
        axios.post(webhook, markdown).then(res => {
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
        });
    });


};