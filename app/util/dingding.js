// 调用钉钉接口

import axios from "axios";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
/**
 * 调用钉钉接口发送消息
 * @param {string} url  消息发送路径
 * @param {string} message  发送的消息信息
 */
export const sendOutMessage = (url, message) => {
    url = "https://oapi.dingtalk.com/robot/send?access_token=ca182864177c4136e7bb08cd4bf937c7bde02fd5bb4c84756b4281c8c6df7914";
    message = "【会议通知】 河伯工牌没带奶茶一杯";
    return new Promise((resolve, reject) => {
        axios.post(url, { msgtype: "text", text: { content: message }, at: { isAtAll: true } }).then(res => {
            let responseData = res.data;
            if (responseData.errcode) {
                resolve({ code: RESULT_ERROR, msg: "发送信息失败" });
                return;
            }
            resolve({ code: RESULT_SUCCESS, msg: "发送信息成功" });
            console.log("===调用钉钉接口", res.data);
        });
    });


};