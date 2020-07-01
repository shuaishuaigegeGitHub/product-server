import Router from "koa-router";
import { fileList } from "../service/fileService";


const router = new Router({
    prefix: "/file"
});
router.post("/fileList", async (ctx) => {
    ctx.body = await fileList(ctx.request.body);
});


export default router;