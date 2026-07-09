import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const attendanceService = {
  recordAttendance: async (data) => {
    return apiCall('post', API_ENDPOINTS.ATTENDANCE.RECORD, data);
  },

  getStudentAttendance: async (params) => {
    const query = new URLSearchParams(params).toString();
    return apiCall('get', `${API_ENDPOINTS.ATTENDANCE.STUDENT}?${query}`);
  },

  getCourseAttendance: async (params) => {
    const query = new URLSearchParams(params).toString();
    return apiCall('get', `${API_ENDPOINTS.ATTENDANCE.COURSE}?${query}`);
  },

  updateAttendance: async (data) => {
    return apiCall('put', API_ENDPOINTS.ATTENDANCE.UPDATE, data);
  },
};
