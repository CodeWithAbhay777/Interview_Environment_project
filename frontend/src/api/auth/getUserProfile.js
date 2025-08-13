import axios from '../../lib/axiosInstance';

export const getUserProfile = async (id , role) => {
    let urlTail = '';


    if (role === 'candidate') urlTail = 'candidate';
    if (role === 'admin' || role === 'recruiter') urlTail = 'recruiter';

    const response = await axios.get(`/profile/${urlTail}`, {params : {role : role , userId : id}});
    return response.data.data;
}