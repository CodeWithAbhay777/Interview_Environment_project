import axios from '../../lib/axiosInstance.js';

export const logoutUser = async () => {
    
        const response = await axios.post(`/user/logout`);
        return response.data;
    
}