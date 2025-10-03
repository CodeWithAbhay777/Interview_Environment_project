import axios from '../../lib/axiosInstance.js';

export const getAllInterviews = async (params = {}) => {
    const response = await axios.get('/interview', { 
        params 
    });
    return response.data;
}