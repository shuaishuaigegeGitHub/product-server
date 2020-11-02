import models from '../models';
import dayjs from "dayjs";
import { RESULT_SUCCESS, RESULT_ERROR } from '../constants/ResponseCode';
import { sqlAppent } from "../util/sqlAppent";
/**
 * 产品池保存
 */
export const poolSave = async (params) => {
    await models.po_product_pool.create({
        name: params.name,
        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        remark: params.remark
    });
    return { code: RESULT_SUCCESS, msg: "保存成功" };
};
/**
 * 产品池更新
 */
export const poolUpdate = async (params) => {
    await models.po_product_pool.update({
        name: params.name,
        remark: params.remark
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "更新成功" };
};
/**
 * 产品池删除
 */
export const pooldel = async (params) => {
    await models.po_product_pool.destroy({
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除成功" };
};
/**
 * 产品池查询
 */
export const poolSearch = async (params) => {
    let result = await models.po_product_pool.findAll({
        raw: true
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 保存产品数据
 * @param {*} params 
 */
export const productSave = async (params, token) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 保存产品
        let result = await models.po_product.create({
            create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            product_name: params.product_name,
            month: dayjs().format("YYYY-MM"),
            pool_id: params.pool_id,
            priority: params.priority,
            provide_id: params.provide_id,
            provide_name: params.provide_name,
            project_type: params.project_type,
            technology_type: params.technology_type,
            weight: params.weight,
            source: params.source,
            theme: params.theme,
            starting: params.starting,
            person: token.userName,
            reason: params.reason,
            innovate_synopsis: params.innovate_synopsis,
            innovate_target: params.innovate_target,
            original_name: params.original_name,
            manufacturer_name: params.manufacturer_name,
            game_connection: params.game_connection,
            achievement_description: params.achievement_description,
            game_description: params.game_description,
            user_group: params.user_group,
            play_theme: params.play_theme,
            game_difficulty: params.game_difficulty,
            game_type: params.game_type,
            interest: params.interest,
            point_design: params.point_design,
            original_time: params.original_time,
            original_remark: params.original_remark,
            status: params.status,
            poll: params.poll,
            project_approval_user: params.project_approval_user,
            age: params.age,
            gender: params.gender,
            optimization: params.optimization,
            analysis_conclusion: params.analysis_conclusion,
            inspiration: params.inspiration
        }, transaction);
        if (result) {
            // 保存文件
            result = result.get();
            if (params.fileList && params.fileList.length) {
                let fiels = [];
                params.fileList.forEach(item => {
                    fiels.push({
                        type: item.type,
                        name: item.name,
                        path: item.path,
                        size: item.size,
                        product_id: result.id,
                        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    });
                });
                await models.po_file.bulkCreate(fiels, { transaction });

            }
            await transaction.commit();
            return { code: RESULT_SUCCESS, msg: "保存成功", id: result.id };
        }

        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存失败" };

    } catch (error) {
        console.log("保存产品数据错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "保存错误" };
    }
};
/**
 * 更新产品数据
 * @param {*} params 
 */
export const productUpdate = async (params) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 更新产品
        let result = await models.po_product.update({
            update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            product_name: params.product_name,
            pool_id: params.pool_id,
            priority: params.priority,
            provide_id: params.provide_id,
            provide_name: params.provide_name,
            project_type: params.project_type,
            technology_type: params.technology_type,
            weight: params.weight,
            source: params.source,
            theme: params.theme,
            starting: params.starting,
            person: params.person,
            reason: params.reason,
            innovate_synopsis: params.innovate_synopsis,
            innovate_target: params.innovate_target,
            original_name: params.original_name,
            manufacturer_name: params.manufacturer_name,
            game_connection: params.game_connection,
            achievement_description: params.achievement_description,
            game_description: params.game_description,
            user_group: params.user_group,
            play_theme: params.play_theme,
            game_difficulty: params.game_difficulty,
            game_type: params.game_type,
            interest: params.interest,
            point_design: params.point_design,
            original_time: params.original_time,
            original_remark: params.original_remark,
            poll: params.poll,
            project_approval_user: params.project_approval_user,
            age: params.age,
            gender: params.gender,
            optimization: params.optimization,
            analysis_conclusion: params.analysis_conclusion,
            inspiration: params.inspiration
        }, {
            where: {
                id: params.id
            },
            transaction
        });
        if (result) {
            // 删除logo，二维码，然后重新保存
            await models.po_file.destroy({
                where: {
                    product_id: params.id,
                    type: { $in: [1] }
                },
                transaction
            });
            // 存在被删除的文件
            if (params.delFiles && params.delFiles.length) {
                await models.po_file.destroy({
                    where: {
                        id: { $in: params.delFiles }
                    },
                    transaction
                });
            }

            // 保存文件
            if (params.fileList && params.fileList.length) {
                let fiels = [];
                params.fileList.forEach(item => {
                    fiels.push({
                        type: item.type,
                        name: item.name,
                        path: item.path,
                        size: item.size,
                        product_id: params.id,
                        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    });
                });
                await models.po_file.bulkCreate(fiels, { transaction });

            }
            await transaction.commit();
            return { code: RESULT_SUCCESS, msg: "更新成功" };
        }

        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "更新失败" };

    } catch (error) {
        console.log("保存产品数据错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "更新错误" };
    }
};
/**
 * 作废产品
 */
export const productCancel = async (params) => {
    await models.po_product.update({
        del: 2
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "作废成功" };
};
/**
 * 还原产品
 */
export const productReduction = async (params) => {
    await models.po_product.update({
        del: 1
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "还原成功" };
};
/**
 * 删除产品
 */
export const productDelete = async (params) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 删除产品表数据
        await models.po_product.destroy({
            where: {
                id: params.id
            },
            transaction
        });
        await models.po_file.destroy({
            where: {
                product_id: params.id
            }, transaction
        });
        await transaction.commit();
        // 删除文教表数据
        return { code: RESULT_SUCCESS, msg: "删除成功" };
    } catch (error) {
        console.log("删除产品错误", error);
        await transaction.rollback();
        return { code: RESULT_ERROR, msg: "删除错误" };
    }

};
/**
 * 查询产品数据
 */
export const productSearch = async (params) => {
    let sql = ` SELECT * FROM po_product t1  `;
    let replacements = [];
    let obj = {
        "id$=": params.id,
        "create_time$b": params.create_time,
        "pool_id$=": params.pool_id,
        "month$=": params.month,
        "project_type$=": params.project_type,
        "technology_type$=": params.technology_type,
        "source$=": params.source,
        "theme$=": params.theme,
        "starting$=": params.starting,
        "status$=": params.status || 1,
        "del$=": params.del || 1,
        "game_type$=": params.game_type,
    },
        sqlMap = {
            "id": "t1.id",
            "create_time": "t1.create_time",
            "pool_id": "t1.pool_id",
            "month": "t1.month",
            "project_type": "t1.project_type",
            "technology_type": "t1.technology_type",
            "technology_type": "t1.technology_type",
            "source": "t1.source",
            "theme": "t1.theme",
            "starting": "t1.starting",
            "status": "t1.status",
            "del": "t1.del",
            "game_type": "t1.game_type"
        };
    let sqlResult = sqlAppent(obj, sqlMap, sql);
    sql += sqlResult.sql;
    replacements = sqlResult.param;
    let result = await models.sequelize.query(sql, { replacements: replacements, type: models.SELECT });
    if (result && result.length) {
        let ids = [];
        result.forEach(item => {
            ids.push(item.id);
        });
        if (ids.length) {
            let fies = await models.po_file.findAll({
                where: {
                    product_id: { $in: ids }
                }
            });
            let pr_fileMap = {};
            fies.forEach(item => {
                if (pr_fileMap[item.product_id]) {
                    pr_fileMap[item.product_id].push(item);
                } else {
                    pr_fileMap[item.product_id] = [item];
                }
            });
            result.forEach(item => {
                item.fileList = pr_fileMap[item.id];
            });
        }

    }
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 游戏题材保存
 */
export const themeSave = async (params) => {
    await models.u_theme.create({
        theme: params.theme,
        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    return { code: RESULT_SUCCESS, msg: "保存成功", };
};
/**
 * 游戏题材修改
 */
export const themeUpdate = async (params) => {
    await models.u_theme.update({
        theme: params.theme
    }, {
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "更新成功", };
};

/**
 * 游戏题材删除
 */
export const themeDel = async (params) => {
    await models.u_theme.destroy({
        where: {
            id: params.id
        }
    });
    return { code: RESULT_SUCCESS, msg: "删除成功", };
};

/**
 * 游戏题材查询
 */
export const themeSearch = async (params) => {
    let result = await models.u_theme.findAll({
    });
    return { code: RESULT_SUCCESS, msg: "查询成功", data: result };
};
/**
 * 产品池项目立项转到立项表
 */
export const projectApproval = async (params) => {
    let transaction = await models.sequelize.transaction();
    try {
        // 修改产品池产品的状态
        await models.po_product.update({
            status: 2,
        }, {
            where: {
                id: params.id
            },
            transaction
        });
        // 立项产品表插入一条数据
        await models.lx_product.create({
            create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            product_pool_id: params.id,
            priority: params.priority,
            month: dayjs().format("YYYY-MM"),
            product_name: params.product_name,
            status: params.status,
            manage_id: params.manage_id,
            manage_name: params.manage_name,
            plan_manage_id: params.plan_manage_id,
            plan_manage_name: params.plan_manage_name
        }, transaction);
        await transaction.commit();
        return { code: RESULT_SUCCESS, msg: "立项成功" };
    } catch (error) {
        console.log("立项错误", error);
        await transaction.rollback();
        return { code: RESULT_SUCCESS, msg: "立项错误" };
    }

};
/**
 * 立项时参数追加
 */
export const paramsAppent = async (params) => {
    await models.po_product.update({
        picture_quality: params.picture_quality,
        handle_feeling: params.handle_feeling,
        reduction_degree: params.reduction_degree
    }, {
        where: {
            id: params.id
        }
    });
    // 保存文件
    if (params.fileList && params.fileList.length) {
        let fiels = [];
        params.fileList.forEach(item => {
            fiels.push({
                type: item.type,
                name: item.name,
                path: item.path,
                size: item.size,
                product_id: params.id,
                create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });
        });
        await models.po_file.bulkCreate(fiels);

    }
    return { code: RESULT_SUCCESS, msg: "保存成功" };
};