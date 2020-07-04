import Router from "koa-router";
import { fileList, saveFile, deleteFile } from "../service/FileService";


const router = new Router({
    prefix: "/file"
});
// 获取文件列表
router.post("/fileList", async (ctx) => {
    ctx.body = await fileList(ctx.request.body);
});
// 保存文件
router.post("/saveFile", async (ctx) => {
    ctx.body = await saveFile(ctx.request.body, ctx.state);
});
// 删除文件
router.post("/deleteFile", async (ctx) => {
    ctx.body = await deleteFile(ctx.request.body, ctx.state);
});




export default router;