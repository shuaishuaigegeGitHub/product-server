import jsonwebtoken from 'jsonwebtoken';
import * as ResponseCode from '@app/constants/ResponseCode';
import models from '@app/models/index';
import GlobalError from '@app/common/GlobalError';

const secretOrPrivateKey = process.env.TOEKN_KEY; // 这是加密的key（密钥）

export default () => {
    return async (ctx, next) => {
        if (process.env.NODE_ENV === 'development') {
            // 开发环境不做登录校验
            await next();
        } else {
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
    
                //判断是否是超级管理员
                if (Number(result.is_admin) !== 1) {
                    //判断用户是否有访问当前接口权限
                    //第一步，获取用户权限
                    const sysAdmin = await models.sys_admins.findOne({
                        where: {
                            user_id: result.uid,
                            status: 1
                        }
                    });
                }
    
                ctx.state = result;
                if (result.first_login && result.first_login.indexOf('PRODUCT') > -1) {
                    // 如果 first_login 不等 null，并且其中包含字符串 CAIWU 则表示该账号不是第一次登陆。
                    ctx.state.first_login = false;
                } else {
                    ctx.state.first_login = true;
                }
            } catch (error) {
                throw new GlobalError(ResponseCode.ERROR_LOGIN, '未登录');
            }
            await next();
        }
    };
};
