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
    const excludeMethod = options.excludeMethod || [];

    return async (ctx, next) => {
        if (!excludeMethod.includes(ctx.request.method)) {
            const userAgent = ctx.request.header['user-agent'];
            const ua = new UAParser(userAgent);
            const OS = ua.getOS();
            const browser = ua.getBrowser();
            const ip = getIp(ctx.req) || '';
            const log = {
                method: ctx.request.method,
                api_path: ctx.request.url,
                os: `${OS.name} ${OS.version}`,
                browser: `${browser.name} ${browser.version}`,
                ip: ip.replace('::ffff:', '')
            };
            const startTime = dayjs().valueOf();
            await next();
            const endTime = dayjs().valueOf();
            log.request_time = endTime - startTime;
            log.request_body = JSON.stringify(ctx.request.body);
            log.response_body = JSON.stringify(ctx.body);
            if (ctx.state && ctx.state.userName) {
                log.operator = ctx.state.userName;
            } else {
                log.operator = '未知用户';
            }
            models.sys_log.create(log);
        } else {
            await next();
        }
    };
};
