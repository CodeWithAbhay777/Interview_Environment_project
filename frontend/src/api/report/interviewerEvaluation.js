import axios from '../../lib/axiosInstance.js';

export const interviewerEvaluation = async (evaluationPayload) => {
  const response = await axios.post('/report/interviewer-evaluation', evaluationPayload, {
    withCredentials: true,
  });

  return response.data;
};