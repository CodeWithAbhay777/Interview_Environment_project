
import axios from '../../lib/axiosInstance.js';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/user/register`, userData);
        return response.data;
    } catch (error) {
        throw error.message;
    }
}