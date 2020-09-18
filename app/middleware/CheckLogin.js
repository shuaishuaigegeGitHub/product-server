import jsonwebtoken from 'jsonwebtoken';
import * as ResponseCode from '@app/constants/ResponseCode';
import GlobalError from '@app/common/GlobalError';

const secretOrPrivateKey = process.env.TOEKN_KEY; // 这是加密的key（密钥）

export default (options = {}) => {
    let excludePath = options.excludePath || [];
    return async (ctx, next) => {
        if (process.env.NODE_ENV === 'development') {
            // 开发环境不做登录校验
            await next();
        } else {
            let needLoginCheck = true;
            for (let regPath of excludePath) {
                if (regPath.test(ctx.request.url)) {
                    needLoginCheck = false;
                    break;
                }
            }
            if (needLoginCheck) {
                // 从body或query或者header中获取token
                let token = ctx.request.headers['token'];

                if (!token || token === '' || token === undefined) {
                    throw new GlobalError(ResponseCode.ERROR_LOGIN, 'token不允许为空');
                }
                try {
                    const result = await new Promise((resolve, reject) => {
                        jsonwebtoken.verify(token, secretOrPrivateKey, (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(res);
                            }
                        });
                    });
                    if (result.exp < Date.now() / 1000) {
                        throw new GlobalError(ResponseCode.ERROR_LOGIN, 'token已过期');
                    }
                    if (result.first_login && result.first_login.indexOf('PRODUCT') > -1) {
                        // 如果 first_login 不等 null，并且其中包含字符串 CAIWU 则表示该账号不是第一次登陆。
                        result.first_login = false;
                    } else {
                        result.first_login = true;
                    }
                    ctx.state = result;
                } catch (error) {
                    console.error(error);
                    throw new GlobalError(ResponseCode.ERROR_LOGIN, '未登录');
                }
            }
            await next();
        }
    };
};
