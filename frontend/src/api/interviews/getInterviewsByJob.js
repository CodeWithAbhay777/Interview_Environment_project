import axios from '../../lib/axiosInstance.js';

export const getInterviewsByJob = async (filter = {}, jobId) => {
    if (!jobId) {
        throw new Error('Job ID is required');
    }
    
    const response = await axios.get('/interview/all', { 
        params: { 
            jobId, 
            ...filter 
        } 
    });
    return response.data;
}