import axios from '../../lib/axiosInstance.js';

export const getAdminJobs = async (filter) => {
    
        const response = await axios.get(`/jobs/admin`, {params : filter});
        return response.data;
    
}