import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param)=>{
await models.product_check.create({

id:param.id,

product_id:param.product_id,

version_number:param.version_number,

type:param.type,

meeting_theme:param.meeting_theme,

meeting_address:param.meeting_address,

meeting_date:param.meeting_date,

meeting_time:param.meeting_time,

sponsor:param.sponsor,

host:param.host,

participants:param.participants,

record:param.record,

result:param.result,

})
return { code: RESULT_SUCCESS, msg: "添加成功" };
}

//更新
export const update = async (param)=>{
await models.product_check.update({

id:param.id,

product_id:param.product_id,

version_number:param.version_number,

type:param.type,

meeting_theme:param.meeting_theme,

meeting_address:param.meeting_address,

meeting_date:param.meeting_date,

meeting_time:param.meeting_time,

sponsor:param.sponsor,

host:param.host,

participants:param.participants,

record:param.record,

result:param.result,

},{
where:{
id:param.id
}
})
return { code: RESULT_SUCCESS, msg: "修改成功" };
}
//删除
export const del = async (param)=>{
await models.product_check.destroy({
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
const { count,rows } = await models.product_check.findAndCountAll({
limit: param.pagesize,
offset: (param.page - 1) * param.pagesize,
where:{

},
})
return { code: RESULT_SUCCESS,count,rows };
}