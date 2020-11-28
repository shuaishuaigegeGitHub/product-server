import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param)=>{
await models.task.create({

id:param.id,

id:param.id,

product_id:param.product_id,

user_id:param.user_id,

group_id:param.group_id,

deadline:param.deadline,

label:param.label,

task_content:param.task_content,

title:param.title,

cron_date:param.cron_date,

describe:param.describe,

status:param.status,

start_time:param.start_time,

remark:param.remark,

end_time:param.end_time,

createtime:param.createtime,

real_create_time:param.real_create_time,

updatetime:param.updatetime,

real_end_time:param.real_end_time,

is_self:param.is_self,

cancel_time:param.cancel_time,

is_subject:param.is_subject,

layer:param.layer,

parent_id:param.parent_id,

status:param.status,

executors:param.executors,

acceptor:param.acceptor,

comment:param.comment,

check:param.check,

reject_reason:param.reject_reason,

})
return { code: RESULT_SUCCESS, msg: "添加成功" };
}

//更新
export const update = async (param)=>{
await models.task.update({

id:param.id,

id:param.id,

product_id:param.product_id,

user_id:param.user_id,

group_id:param.group_id,

deadline:param.deadline,

label:param.label,

task_content:param.task_content,

title:param.title,

cron_date:param.cron_date,

describe:param.describe,

status:param.status,

start_time:param.start_time,

remark:param.remark,

end_time:param.end_time,

createtime:param.createtime,

real_create_time:param.real_create_time,

updatetime:param.updatetime,

real_end_time:param.real_end_time,

is_self:param.is_self,

cancel_time:param.cancel_time,

is_subject:param.is_subject,

layer:param.layer,

parent_id:param.parent_id,

status:param.status,

executors:param.executors,

acceptor:param.acceptor,

comment:param.comment,

check:param.check,

reject_reason:param.reject_reason,

},{
where:{
id:param.id
}
})
return { code: RESULT_SUCCESS, msg: "修改成功" };
}
//删除
export const del = async (param)=>{
await models.task.destroy({
where:{
id:param.id
}
})
return { code: RESULT_SUCCESS, msg: "删除成功" };
}

//查询
export const findAll = async (param)=>{
param.pagesize = Number(param.pagesize);
param.page = Number(param.page);
const { count,rows } = await models.task.findAndCountAll({
limit: param.pagesize,
offset: (param.page - 1) * param.pagesize,
where:{

},
})
return { code: RESULT_SUCCESS,count,rows };
}