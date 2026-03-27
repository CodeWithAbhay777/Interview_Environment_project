import axios from '../../lib/axiosInstance.js';

export const evaluateCandidateAnswer = async (evaluationPayload) => {
  const response = await axios.post('/report/AI-evaluation', evaluationPayload, {
    withCredentials: true,
  });

  return response.data;
};