import axios from '../../lib/axiosInstance.js';

export const updateInterviewDetails = async (interviewId, interviewData) => {
  if (!interviewId) {
    throw new Error('Interview ID is required');
  }

  const response = await axios.put(`/interview/edit/${interviewId}`, interviewData);
  return response.data;
};
