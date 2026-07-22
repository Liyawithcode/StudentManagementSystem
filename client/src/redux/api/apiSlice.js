import axiosInstance from '../../config/axios.js';

export const apiCall = async (method, url, data = null, options = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    let message = error.response?.data?.message;
    if (!message && typeof error.response?.data === 'string' && error.response.data.trim()) {
      message = error.response.data;
    }
    if (!message && error.message) {
      if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
        message = 'Server response error. Please check your network connection or try again.';
      } else {
        message = error.message;
      }
    }
    throw new Error(message || 'Something went wrong');
  }
};

export default axiosInstance;
