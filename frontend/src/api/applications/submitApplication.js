import axios from '../../lib/axiosInstance';

export const postApplication = async (formData) => {
    
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/application/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        return response.data;
    
}