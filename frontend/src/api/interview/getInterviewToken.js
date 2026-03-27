import axios from '../../lib/axiosInstance.js';

export const getInterviewToken = async (interviewId) => {
    
    
    const response = await axios.post('/room/interview/token', 
        interviewId 
    );
    return response.data;
}