import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const groupService = {
  getAllGroups: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.GROUPS.BASE}?${query}` : API_ENDPOINTS.GROUPS.BASE;
    return apiCall('get', url);
  },

  getGroupById: async (id) => {
    if (!id || id === 'null' || id === 'undefined') return { group: null };
    return apiCall('get', API_ENDPOINTS.GROUPS.BY_ID(id));
  },

  createGroup: async (data) => {
    return apiCall('post', API_ENDPOINTS.GROUPS.BASE, data);
  },

  updateGroup: async (id, data) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid group ID');
    return apiCall('put', API_ENDPOINTS.GROUPS.BY_ID(id), data);
  },

  deleteGroup: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid group ID for deletion');
    return apiCall('delete', API_ENDPOINTS.GROUPS.BY_ID(id));
  },
};
