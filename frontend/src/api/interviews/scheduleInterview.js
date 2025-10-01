import axios from '../../lib/axiosInstance.js';

export const scheduleInterview = async (interviewData) => {
    const response = await axios.post('/interview/schedule', interviewData);
    return response.data;
}