import dayjs from 'dayjs';

// 正常时间格式化：2020-06-17 16:40:11
export const NORMAL_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// 时间戳（秒）转字符串时间
export const unixToStr = (unix, format = NORMAL_TIME_FORMAT) => {
    return dayjs.unix(unix).format(format);
};