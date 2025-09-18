import axios from '../../lib/axiosInstance.js';

export const getAllJobs = async (filter) => {
    
        const response = await axios.get(`/jobs/list`, {params : filter});
        return response.data;
    
}