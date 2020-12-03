import axios from 'axios';

export const query = async (token) => {
    let response = await axios({
        url: process.env.OA_SYSTEM_BASE_URL + '/admin/user/getUsers',
        method: 'POST',
        headers: {
            token
        }
    });
    let res = response.data;
    let userList = res.userList;
    return userList.map(item => {
        return {
            user_id: item.user_id,
            username: item.user_name,
            status: item.status
        };
    });
};
export const userMap = async (token) => {
    let response = await axios({
        url: process.env.OA_SYSTEM_BASE_URL + '/admin/user/getUsers',
        method: 'POST',
        headers: {
            token
        }
    });
    let res = response.data;
    let userList = res.userList;
    let userMap = {};
    userList.forEach(item => {
        userMap[item.id] = {
            user_id: item.user_id,
            username: item.user_name,
            status: item.status,
            avatar: item.avatar
        };
    });
};