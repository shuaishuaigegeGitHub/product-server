import Router from 'koa-router';
import * as service from '../service/TaskService';
import models from "../models/index";

const router = new Router({
    prefix: '/taskTemplate'
});

/**
 * 
 */
router.post('/spotData', async (ctx) => {
    let { year, month } = ctx.request.body;
    let seatrTime = (new Date(year, month, 1, 0, 0, 0).getTime()) / 1000;
    let endTime = new Date(year, Number(month) + 1, 1, 23, 59, 59);
    endTime.setDate(-1);
    endTime = (endTime.getTime()) / 1000;
    let sql = ` SELECT create_time  FROM task WHERE create_time BETWEEN ${seatrTime} and ${endTime} ORDER BY create_time DESC `;
    let result = await models.sequelize.query(sql, { type: models.SELECT });
    ctx.body = { code: 1000, data: result };

});

/**
 * 
 */
router.post('/taskData', async (ctx) => {
    let { time } = ctx.request.body;
    time = new Date(time);
    console.log("time", time);
    let seatrTime = (new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, 0, 0).getTime()) / 1000;
    let endTime = (new Date(time.getFullYear(), time.getMonth(), time.getDate(), 23, 59, 59).getTime()) / 1000;
    console.log(seatrTime, endTime, time.getFullYear(), time.getMonth(), time.getDate());
    let sql = ` SELECT t1.*,t2.type_name,t3.module_name FROM task t1 LEFT JOIN task_type t2 ON t2.id=t1.task_type LEFT JOIN task_module t3 ON t3.id=t1.module_id  WHERE t1.create_time BETWEEN ${seatrTime} and ${endTime} ORDER BY t1.create_time DESC `;
    let result = await models.sequelize.query(sql, { type: models.SELECT });
    ctx.body = { code: 1000, data: result };

});

export default router;
