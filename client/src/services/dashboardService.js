import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const dashboardService = {
  getStats: async () => {
    return apiCall('get', API_ENDPOINTS.DASHBOARD.STATS);
  },
};
export default dashboardService;
