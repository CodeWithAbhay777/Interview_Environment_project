import axios from '../../lib/axiosInstance';

export const submitUserProfile = async (formData) => {
    
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/profile/candidate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        return response.data;
    
}