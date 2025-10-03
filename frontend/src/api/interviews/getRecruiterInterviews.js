import axios from '../../lib/axiosInstance.js';

export const getRecruiterInterviews = async (params = {}) => {
    const response = await axios.get('/interview/recruiter', { 
        params 
    });
    return response.data;
}