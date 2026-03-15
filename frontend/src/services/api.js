import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://clean-tourist-waste-management.onrender.com/api',
  timeout: 10000, // Increase timeout to 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL configured as:', api.defaults.baseURL);

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[API Network Error] Possible causes: Backend not running, CORS issues, or Network disconnected.');
    } else {
      console.error(`[API Response Error] ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
