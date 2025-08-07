import axios from "../../lib/axiosInstance.js";

export const verifyEmail = async ({email , id , code}) => {
    
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/email/verify`, {email , id , code} );
        return response.data.message;
    
}