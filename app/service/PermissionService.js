import axios from 'axios';

// 从oa系统获取财务系统的菜单信息
export const getMenu = async (token) => {
    const res = await axios({
        url: `${process.env.OA_SYSTEM_BASE_URL}/admin/menu/userMenuTree`,
        method: 'post',
        data: {
            token,
            perms: 'PRODUCT'
        }
    });
    res.data.datas[0].address = res.data.address;
    return res.data.datas;
};


// 从oa系统获取系统级别的信息
export const getSystem = async (token) => {
    const res = await axios({
        url: `${process.env.OA_SYSTEM_BASE_URL}/admin/menu/onLevelMune`,
        method: 'post',
        data: {
            token
        }
    });
    return res.data.list;
};

/**
 * 修改用户是否首次登陆
 * @param {string} token
 */
export const changeLoginStatus = async (token) => {
    const res = await axios({
        url: `${process.env.OA_SYSTEM_BASE_URL}/admin/user/addFirstLogin`,
        method: 'post',
        data: {
            token,
            first_login: 'PRODUCT'
        }
    });
    return res.data;
};