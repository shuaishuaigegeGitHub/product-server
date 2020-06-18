import dayjs from 'dayjs';
import models from '@app/models/index';
import UAParser from 'ua-parser-js';

/**
 * 获取请求IP
 * @param {object} req 
 */
function getIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
}

// 操作日志记录
export default (options = {}) => {
    let excludeMethod = options.excludeMethod || [];

    return async (ctx, next) => {
        if (!excludeMethod.includes(ctx.request.method)) {
            let userAgent = ctx.request.header['user-agent'];
            let ua = new UAParser(userAgent);
            let OS = ua.getOS();
            let browser = ua.getBrowser();
            let ip = getIp(ctx.req) || '';
            let log = {
                method: ctx.request.method,
                api_path: ctx.request.url,
                os: OS.name + ' ' + OS.version,
                browser: browser.name + ' ' + browser.version,
                ip: ip.replace('::ffff:', '')
            };
            let startTime = dayjs().valueOf();
            await next();
            let endTime = dayjs().valueOf();
            log.request_time = endTime - startTime;
            log.request_body = JSON.stringify(ctx.request.body);
            log.response_body = JSON.stringify(ctx.body);
            if (ctx.state && ctx.state.user_name) {
                log.operator = ctx.state.user_name;
            } else {
                log.operator = '未知用户';
            }
            models.sys_log.create(log);
        } else {
            await next();
        }
    };
}
