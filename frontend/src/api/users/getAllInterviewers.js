import axios from '../../lib/axiosInstance.js';

export const getAllInterviewers = async () => {
    const response = await axios.get(`/user/interviewers`);
    return response.data;
}