import axios from '../../lib/axiosInstance.js'; 

export const editJob = async (jobID, jobData) => {
    const response = await axios.put(`/jobs/edit/${jobID}`, jobData);
    return response.data;
}