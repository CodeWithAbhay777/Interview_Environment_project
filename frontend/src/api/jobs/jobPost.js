import axios from '../../lib/axiosInstance.js';

export const jobPost = async (jobData) => {
    
        const response = await axios.post(`/jobs/create`, jobData);
        return response.data;
    
}