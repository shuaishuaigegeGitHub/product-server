import dayjs from 'dayjs';
import CalenderFormat from 'dayjs/plugin/calendar';

dayjs.extend(CalenderFormat);

// 正常时间格式化：2020-06-17 16:40:11
export const NORMAL_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// 时间戳（秒）转字符串时间
export const unixToStr = (unix, format = NORMAL_TIME_FORMAT) => {
    return dayjs.unix(unix).format(format);
};

/**
 * 对象内的某些字段时间戳格式化时间
 * @param {object} obj 
 * @param {object} options 配置
 */
export const objTimeFormater = (obj, options = {}) => {
    if (!obj) {
        return obj;
    }
    // 是否在当前实例上操作
    let cur = (options.cur === undefined || options.cur === null) ? true : options.cur;
    let format = options.format || NORMAL_TIME_FORMAT;
    let keys = ['create_time', 'update_time'];
    if (options.keys) {
        keys = keys.concat(options.keys);
    }
    let result = obj;
    if (!cur) {
        result = Object.assign({}, obj);
    }
    if (!format) {
        format = NORMAL_TIME_FORMAT;
    }
    if (keys && keys.length) {
        for (let key of keys) {
            if (obj[key]) {
                obj[key] = unixToStr(obj[key], format);
            }
        }
    }
    return result;
};

/**
 * 返回距离现在的相对时间（几天前，几周前）
 * @param {number} unix 时间戳（秒）
 */
export const calendarTimeFormater = (unix) => {
    return dayjs.unix(unix).calendar();
};