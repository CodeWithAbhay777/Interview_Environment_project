import axios from '../../lib/axiosInstance.js';

export const loginUser = async (userData) => {
    
        const response = await axios.post(`/user/login`, userData);
        return response.data;
    
}