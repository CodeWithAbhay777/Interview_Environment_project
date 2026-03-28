import axios from '../../lib/axiosInstance.js';

export const runCode = async (sourceCode, languageId) => {
    
    
    const response = await axios.post('/room/interview/codeExecution', {
        source_code: sourceCode,
        language_id: languageId
    });
    return response.data;
}