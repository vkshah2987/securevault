import axios from 'axios';
import { logoutUser } from './logoutHelper'; // we'll create this in a sec

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logoutUser(); // logout globally
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
