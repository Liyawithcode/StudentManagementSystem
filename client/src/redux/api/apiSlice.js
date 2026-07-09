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
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    throw new Error(message);
  }
};
export default axiosInstance;
