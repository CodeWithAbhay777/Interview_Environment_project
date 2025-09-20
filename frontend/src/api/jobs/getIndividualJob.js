import axios from '../../lib/axiosInstance.js';

export const getIndividualJob = async (id) => {

        const response = await axios.get(`/jobs/${id}`);
        return response.data;
    
}