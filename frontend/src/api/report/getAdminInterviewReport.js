import axios from '../../lib/axiosInstance.js';

export const getAdminInterviewReport = async (interviewId) => {
  const response = await axios.get(`/report/admin/${interviewId}`);
  return response.data;
};
