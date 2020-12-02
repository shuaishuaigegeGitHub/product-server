import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";


//添加
export const add = async (param)=>{
await models.product_check_detail.create({

id:param.id,

product_id:param.product_id,

user_id:param.user_id,

adopt_result:param.adopt_result,

optimization_opinions:param.optimization_opinions,

})
return { code: RESULT_SUCCESS, msg: "添加成功" };
}

//更新
export const update = async (param)=>{
await models.product_check_detail.update({

id:param.id,

product_id:param.product_id,

user_id:param.user_id,

adopt_result:param.adopt_result,

optimization_opinions:param.optimization_opinions,

},{
where:{
id:param.id
}
})
return { code: RESULT_SUCCESS, msg: "修改成功" };
}
//删除
export const del = async (param)=>{
await models.product_check_detail.destroy({
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
const { count,rows } = await models.product_check_detail.findAndCountAll({
limit: param.pagesize,
offset: (param.page - 1) * param.pagesize,
where:{

},
})
return { code: RESULT_SUCCESS,count,rows };
}