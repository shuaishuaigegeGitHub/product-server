// 研发列表
import Router from 'koa-router';
import {sendOutMessage} from "../util/dingding"
const router=new Router({
    prefix: '/researchTable'
})

router.post("/sendOutMessage",async (ctx)=>{
 ctx.body= await sendOutMessage()

})

export default router;