import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  res => res,
  (error) => {

    const backendMsg = error.response?.data?.message;
    const customError = new Error(backendMsg);
    customError.status = error.response?.data?.status || 500;
    customError.success = error.response?.data?.success || false;
    
    
    return Promise.reject(customError);
  }
)

export default axiosInstance