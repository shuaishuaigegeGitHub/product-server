import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param)=>{
await models.task_group.create({

id:param.id,

product_id:param.product_id,

group_name:param.group_name,

sort:param.sort,

})
return { code: RESULT_SUCCESS, msg: "添加成功" };
}

//更新
export const update = async (param)=>{
await models.task_group.update({

id:param.id,

product_id:param.product_id,

group_name:param.group_name,

sort:param.sort,

},{
where:{
id:param.id
}
})
return { code: RESULT_SUCCESS, msg: "修改成功" };
}
//删除
export const del = async (param)=>{
await models.task_group.destroy({
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
const { count,rows } = await models.task_group.findAndCountAll({
limit: param.pagesize,
offset: (param.page - 1) * param.pagesize,
where:{

},
})
return { code: RESULT_SUCCESS,count,rows };
}