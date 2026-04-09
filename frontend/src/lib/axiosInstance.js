import axios from 'axios'
import store from '../redux/store'
import { setUser } from '../redux/authSlice'
import { persistStore } from 'redux-persist'



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
   
    const customError = new Error(backendMsg || error.message || 'Request failed');
    console.log("CHECKINGGGGGGGG : ", backendMsg);
    console.log("CHECKINGGGGGGGG : ", error.response?.data?.status);

    if (error.response?.status === 401) {

      const isAuthRoute = error.config?.url?.includes("/user/login");

      if (!isAuthRoute) {
        store.dispatch(setUser({ user: null, isAuthenticated: false }));
        const persistor = persistStore(store);
        persistor.purge();
        navigate("/login");
      }

}

    customError.status = error.response?.data?.status || 500;
    customError.success = error.response?.data?.success || false;


    return Promise.reject(customError);
  }
)

export default axiosInstance;