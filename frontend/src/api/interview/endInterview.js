import axios from '../../lib/axiosInstance.js';

export const endInterview = async (interviewId) => {
    
    
    const response = await axios.post('/room/interview/end', {
        interviewId: interviewId,
    });
    return response.data;
}