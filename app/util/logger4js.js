
import log4js from 'log4js';
import log4js_config from '@config/log4js_config';

log4js.configure(log4js_config);

/**
 * 响应日志中间件
 * @param {*} ctx
 * @param {*} next
 */
export const mwLogRes2File = (ctx, next) => {
    next();

    const logger = log4js.getLogger('res');
    logger.info(JSON.stringify({
        method: ctx.request.method,
        path: ctx.request.path,
        ip: ctx.request.ip,
        query: ctx.request.query,
        params: ctx.request.params,
        req_body: ctx.request.body,
        headers: ctx.request.headers,
        status: ctx.status,
        res_body: ctx.body,
    }));
    return true;
};

/**
 * 记录错误日志
 * @param {*} errMsg
 */
export const logError2File = (errMsg) => {
    const logger = log4js.getLogger('error');
    logger.error(errMsg);
};

/**
 * 记录普通日志
 * @param {*} errMsg
 */
export const logInfo2File = (info) => {
    const logger = log4js.getLogger('main');
    logger.info(info);
};

/**
 * 记录调试日志
 * @param {*} debug
 */
export const logDebug2File = (debug) => {
    const logger = log4js.getLogger('debug');
    logger.info(debug);
};
