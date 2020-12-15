import axios from 'axios';

export const query = async (token) => {
    const response = await axios({
        url: `${process.env.OA_SYSTEM_BASE_URL}/admin/user/getUsers`,
        method: 'POST',
        headers: {
            token
        }
    });
    const res = response.data;
    const userList = res.userList;
    return userList.map(item => ({
        user_id: item.user_id,
        username: item.user_name,
        status: item.status,
        avatar: item.avatar
    }));
};
export const userMap = async (token) => {
    const response = await axios({
        url: `${process.env.OA_SYSTEM_BASE_URL}/admin/user/getUsers`,
        method: 'POST',
        headers: {
            token
        }
    });
    const res = response.data;
    const userList = res.userList;
    const userMap = {};
    userList.forEach(item => {
        userMap[item.user_id] = {
            user_id: item.user_id,
            username: item.user_name,
            status: item.status,
            avatar: item.avatar
        };
    });
    return userMap;
};