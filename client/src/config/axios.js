import axios from 'axios';
import { ENV } from './env.js';

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [
    (data) => {
      if (typeof data === 'string') {
        if (!data || data === 'null' || data === 'undefined') {
          return null;
        }
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    },
  ],
});


// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // If we store token in localStorage, we can append it here, 
    // but the backend uses HTTP-only cookies which are sent automatically.
    // In case the token is in header, we can handle it:
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If backend is unreachable (502/503 from Vite proxy), skip refresh and propagate
    if (error.response && (error.response.status === 502 || error.response.status === 503)) {
      return Promise.reject(error);
    }
    
    // Prevent infinite loop & check if it is 401
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If we are already on login page or attempting to login, don't refresh
      if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh token
        const res = await axios.post(`${ENV.API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        if (res.data && res.data.success) {
          const { accessToken } = res.data;
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Let application state handle redirects
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
