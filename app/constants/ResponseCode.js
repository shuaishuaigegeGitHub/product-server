
/** 签名错误 */
export const ERROR_INVALID_PERMISSION = 201;

/** 未登录后台 */
export const ERROR_ADMIN_NOT_LOGIN = 202;

/** You fuck up */
export const ERROR_RESOURCE_NOT_FOUND = 400;
/** 未登录 */
export const ERROR_LOGIN = 401;
/** 异地登录 */
export const OTHER_LOGIN = 402;
/** 资源权限 */
export const ERROR_RESOURCE_PERMISSION = 403;
/** 事务异常 */
export const ERROR_DB_TRANSACTION = 410;

/** 循环请求 */
export const ERROR_SERVICE_INTERNAL_CYCLE = 506;
/** 延迟请求 */
export const ERROR_SERVICE_INTERNAL_DELAY = 507;

/** 返回成功码 */
export const RESULT_SUCCESS = 1000;
/** 返回失败码 */
export const RESULT_ERROR = 500;