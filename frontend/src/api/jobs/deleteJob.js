import axios from '../../lib/axiosInstance.js';

export const deleteJob = async (jobID) => {
  const response = await axios.delete(`/jobs/delete/${jobID}`);
  return response.data;
};
