import 'module-alias/register';
import Koa from 'koa';
import logger from 'koa-logger';
import convert from 'koa-convert';
import staticFile from 'koa-static';
import koaBody from 'koa-body';
import cors from 'koa2-cors';
import routes from './router/index';
import { RESULT_SUCCESS } from './constants/ResponseCode';
import writeLog from './middleware/WriteLog';
import checkLogin from './middleware/CheckLogin';
// 打印日志
import './util/logger4js';
// import { autoCreateModel, autoCreateSchema } from './util/autoGreateModel';
// autoCreateModel('product_check_table');
// autoCreateSchema("product-new");

const app = new Koa();
app.keys = ['111222333444555666'];
// trust proxy
app.proxy = true;

// 构造JSON返回体
app.context.renderJson = ({ msg, data }) => ({
    code: RESULT_SUCCESS,
    msg,
    data
});


// const staticPath = '../public'
const staticPath = process.env.FILE_SAVE_PATH;
const PORT = Number(process.env.PORT);

app.use(koaBody({
    multipart: true,
    strict: false, // 如果为true，不解析GET,HEAD,DELETE请求
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}));

app.use(convert(logger()));
app.use(cors());

// 全局异常处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log('全局异常：', err);
        ctx.body = {
            code: err.code || err.status || 500,
            msg: err.message
        };
    }
});

// 添加操作日志记录中间件
app.use(writeLog({ excludeMethod: ['GET'] }));
// 测试时自动添加token
// app.use(async (ctx, next) => {
//     ctx.header.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IumZiOaWh-WxsSIsInVpZCI6MTU2LCJyb2xlX2lkIjoiMTYzIiwiaXNfYWRtaW4iOjEsImRlcHRfaWQiOjI3MSwiYXZhdGFyIjoiaHR0cHM6Ly9mbC1jZG4uZmVpZ28uZnVuL0Zvc3QwbkVKUUZLYTBtZlBhNU1CLUF1cUNURXciLCJmaXJzdF9sb2dpbiI6IlBST0RVQ1QsRE9VWUlOLFlVTllJTkcsQ0FJV1UsVklWTyxZVU5ZSU5HLCIsInRva2VuQXBwbGljYXRpb24iOiJzZGpmYW9lamktRkhJR1JPRTM0MS1yZXJlZ2ZyIiwiaWF0IjoxNjA4Nzg5NDM2LCJleHAiOjE2MDkwNDg2MzZ9.U4EU-h0QwBMrFlnBaIXRqCJnEh06G4NzdOWSuieLTD0';
//     await next();
// });
// 登录验证中间件
app.use(checkLogin({ excludePath: [/^\/api\/upload/, /^\/favicon.ico/, /^\/file\//] }));

// 样式注入
app.use(staticFile(
    // path.join(__dirname, staticPath)
    staticPath));


// 路由配置
app.use(routes());

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`项目启动成功：http://localhost:${PORT}`);
    }
});

process.on('SIGINT', () => {
    process.exit();
});

export default app;
