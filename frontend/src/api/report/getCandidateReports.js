import axios from '../../lib/axiosInstance.js';

export const getCandidateReports = async () => {
    const response = await axios.get('/report/candidate');
    return response.data;
};
