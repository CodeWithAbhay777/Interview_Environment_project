import axios from '../../lib/axiosInstance.js';

export const getIndividualJobForAdmin = async (jobID) => {
    const response = await axios.get(`/jobs/admin/${jobID}`);
    return response.data;
}