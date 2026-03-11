import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backtesting-production.up.railway.app/api',
  withCredentials: true,
});

export default axiosInstance;