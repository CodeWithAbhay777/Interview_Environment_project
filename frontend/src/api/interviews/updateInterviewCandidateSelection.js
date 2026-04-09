import axios from '../../lib/axiosInstance.js';

export const updateInterviewCandidateSelection = async (interviewId, isCandidateSelected) => {
  if (!interviewId) {
    throw new Error('Interview ID is required');
  }

  const response = await axios.put(`/interview/${interviewId}/shortlist`, {
    isCandidateSelected: isCandidateSelected ? 'selected' : 'pending'
  });

  return response.data;
};
