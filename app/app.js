import 'module-alias/register';
import Koa from 'koa';
import logger from 'koa-logger';
import convert from 'koa-convert';
import staticFile from 'koa-static';
import koaBody from 'koa-body';
import path from "path";
import cors from 'koa2-cors';
import routes from './router/index';

const app = new Koa();
app.keys = ['111222333444555666'];
// trust proxy
app.proxy = true;

const staticPath = '../public';
const PORT = Number(process.env.PORT);

app.use(koaBody({
    multipart: true,
    strict: false, //如果为true，不解析GET,HEAD,DELETE请求
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}));

app.use(convert(logger()));
app.use(cors());

//样式注入
app.use(staticFile(
    path.join(__dirname, staticPath)
));
// 全局异常处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = {
            code: err.code || err.status || 500,
            msg: err.message
        };
    }
});

// 路由配置
app.use(routes());

app.listen(PORT, (err) => {
    if (!err) {
        console.log('项目启动成功：http://localhost:' + PORT);
    }
});

process.on('SIGINT', () => {
    process.exit();
});

export default app;
