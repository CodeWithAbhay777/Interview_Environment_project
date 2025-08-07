import axios from "../../lib/axiosInstance.js";

export const sendOtp = async (emailInput) => {
    
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/email/verify`, {params : {email : emailInput}} );
        return response.data.message;
    
}