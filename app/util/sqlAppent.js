

module.exports = {
    /**
     * wen
     * sql 拼接
     * @param {*} object 数据对象需要是map对象
     * @param {*} sqlMap map对象对于的sql对象
     * @param {*} sql sql查询语句用来判断是否加where可不传，不传默认需拼接的sql带where，所有条件都会加 and
     * 拼接时变量会用?进行站位 返回一个sql 字符串，和param数组
     * object 需要家$符，$前部分为key和sqlMapkey要一样，$后半部分为对比条件，比如
     * = :=
     * !=: !=
     * l : like
     * nl : not like
     * i : in
     * ni : not in
     * b : between
     * nb : not between
     * f : FIND_IN_SET
     * nf : not FIND_IN_SET
     * >:?
     * <:<
     * >=:>=
     * <=:<=
     */
    sqlAppent(object, sqlMap, sql) {
        const result = {
            sql: '',
            param: []
        };
        let check = true;
        if (!sql) {
            check = false;
        }
        let addSql = '';
        try {
            if (object && sqlMap && typeof object === 'object' && typeof sqlMap === 'object') {
                const keys = Object.keys(object);
                keys.forEach(item => {
                    // 有包含$才进行处理
                    if (item.includes('$')) {
                        const mapKeys = item.split('$');
                        // $拆分后有两个数据，并且sqlmap有对应的数据，boject的数据不为空
                        if (mapKeys.length == 2 && object[item] && sqlMap[mapKeys[0]]) {
                            switch (mapKeys[1]) {
                            case '=':
                                addSql += `  ${sqlMap[mapKeys[0]]} = ? `;
                                result.param.push(object[item]);
                                break;
                            case '!=':
                                addSql += `  ${sqlMap[mapKeys[0]]} != ? `;
                                result.param.push(object[item]);
                                break;
                            case '<':
                                addSql += `  ${sqlMap[mapKeys[0]]} < ? `;
                                result.param.push(object[item]);
                                break;
                            case '>':
                                addSql += `  ${sqlMap[mapKeys[0]]} > ? `;
                                result.param.push(object[item]);
                                break;
                            case '<=':
                                addSql += `  ${sqlMap[mapKeys[0]]} <= ? `;
                                result.param.push(object[item]);
                                break;
                            case '>=':
                                addSql += `  ${sqlMap[mapKeys[0]]} >= ? `;
                                result.param.push(object[item]);
                                break;
                            case 'l':
                                addSql += `  ${sqlMap[mapKeys[0]]}  like  ?  `;
                                result.param.push(`%${object[item]}%`);
                                break;
                            case 'nl':
                                addSql += `  ${sqlMap[mapKeys[0]]}  not like  ?  `;
                                result.param.push(`%${object[item]}%`);
                                break;
                            case 'i':
                                addSql += `  ${sqlMap[mapKeys[0]]}  in (?) `;
                                result.param.push(object[item]);
                                break;
                            case 'ni':
                                addSql += `  ${sqlMap[mapKeys[0]]}  not  in (?) `;
                                result.param.push(object[item]);
                                break;
                            case 'b':
                                if (object[item].length > 1 && object[item][0] && object[item][1]) {
                                    addSql += `  ${sqlMap[mapKeys[0]]}  between ? and ? `;
                                    result.param.push(object[item][0], object[item][1]);
                                }
                                break;
                            case 'nb':
                                if (object[item].length > 1 && object[item][0] && object[item][1]) {
                                    addSql += `  ${sqlMap[mapKeys[0]]} not  between ? and ? `;
                                    result.param.push(object[item][0], object[item][1]);
                                }
                                break;
                            case 'f':
                                addSql += ` find_in_set(${sqlMap[mapKeys[0]]} ?) `;
                                result.param.push(object[item]);
                                break;
                            case 'nf':
                                addSql += ` not find_in_set(${sqlMap[mapKeys[0]]} ?) `;
                                result.param.push(object[item]);
                                break;
                            default:
                                break;
                            }
                            if (check && addSql && !sql.includes('where') && !sql.includes('WHERE')) {
                                check = false;
                                result.sql += ` where ${addSql}`;
                            } else if (addSql) {
                                result.sql += ` and ${addSql}`;
                            }
                            addSql = '';
                        }
                    }
                });
            }
            return result;
        } catch (error) {
            console.log('拼接sql产生错误', error);
            return {
                sql: '',
                param: []
            };
        }
    },
    /**
     * 分页
     * @param {*} page
     * @param {*} pageSize
     */
    sqlLimit(page, pageSize) {
        let sql = '';
        if (page && pageSize && !isNaN(page) && !isNaN(pageSize)) {
            sql += ` limit ${(Number(page) - 1) * pageSize},${pageSize}`;
        }
        return sql;
    }
};
