import axios from '../../lib/axiosInstance.js';

export const getIndividualAdminJob = async (filter , jobID) => {

        const response = await axios.get(`/jobs/admin/${jobID}`, {params : filter});
        return response.data;
    
}