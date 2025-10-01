import axios from '../../lib/axiosInstance.js';

export const getJobInfoByAdmin = async (filter, jobID) => {
    const response = await axios.get(`/jobs/admin/${jobID}/applications`, { params: filter });
    return response.data;
}