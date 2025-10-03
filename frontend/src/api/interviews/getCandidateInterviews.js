import axios from '../../lib/axiosInstance.js';

export const getCandidateInterviews = async (params = {}) => {
    const response = await axios.get('/interview/candidate', { 
        params 
    });
    return response.data;
}