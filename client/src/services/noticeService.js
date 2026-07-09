import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const noticeService = {
  getNotices: async () => {
    return apiCall('get', API_ENDPOINTS.COMMUNICATION.NOTICES);
  },

  createNotice: async (data) => {
    return apiCall('post', API_ENDPOINTS.COMMUNICATION.NOTICES, data);
  },

  deleteNotice: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.COMMUNICATION.NOTICES}/${id}`);
  },
};
