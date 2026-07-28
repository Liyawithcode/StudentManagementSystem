import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const settingsService = {
  getSettings: async () => {
    return apiCall('get', API_ENDPOINTS.SETTINGS.BASE);
  },

  updateSettings: async (data) => {
    return apiCall('put', API_ENDPOINTS.SETTINGS.BASE, data);
  },
};

export default settingsService;
