import axios from 'axios';

export const query = async () => {
    let response = await axios({
        url: process.env.OA_SYSTEM_BASE_URL + '/admin/user/getUsers',
        method: 'POST',
        headers: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwidWlkIjoxLCJyb2xlX2lkIjoxMDcsImlzX2FkbWluIjoxLCJkZXB0X2lkIjoxMDAsImZpcnN0X2xvZ2luIjoiQ0FJV1UsWVVOWUlORyxZVU5ZSU5HLFlVTllJTkcsWVVOWUlORyxZVU5ZSU5HLFlVTllJTkcsWVVOWUlORyxZVU5ZSU5HLCIsInRva2VuQXBwbGljYXRpb24iOiJzZGpmYW9lamktRkhJR1JPRTM0MS1yZXJlZ2ZyIiwiaWF0IjoxNTkyNDY2NjQ2LCJleHAiOjE1OTI1NTMwNDZ9.Vkf4G8cpuLUAhWe9YH05P21c9hhCPn7vY3l84KjEF-o'
        }
    });
    let res = response.data;
    let userList = res.userList;
    return userList.map(item => {
        return {
            user_id: item.user_id,
            user_name: item.user_name,
            status: item.status
        };
    });
};