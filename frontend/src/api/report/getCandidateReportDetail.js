import axios from '../../lib/axiosInstance.js';

export const getCandidateReportDetail = async (reportId) => {
  const response = await axios.get(`/report/candidate/${reportId}`);
  return response.data;
};
