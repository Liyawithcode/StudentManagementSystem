import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const attendanceService = {
  getAllAttendance: async () => {
    return apiCall('get', API_ENDPOINTS.ATTENDANCE.RECORD.replace('/record', ''));
  },

  recordAttendance: async (data) => {
    return apiCall('post', API_ENDPOINTS.ATTENDANCE.RECORD, data);
  },

  getStudentAttendance: async (params) => {
    let queryString = '';
    if (typeof params === 'object' && params !== null) {
      queryString = new URLSearchParams(params).toString();
    } else if (params) {
      queryString = `studentId=${params}`;
    }
    return apiCall('get', `${API_ENDPOINTS.ATTENDANCE.STUDENT}?${queryString}`);
  },

  getCourseAttendance: async (params) => {
    let queryString = '';
    if (typeof params === 'object' && params !== null) {
      queryString = new URLSearchParams(params).toString();
    } else if (params) {
      queryString = `courseId=${params}`;
    }
    return apiCall('get', `${API_ENDPOINTS.ATTENDANCE.COURSE}?${queryString}`);
  },

  updateAttendance: async (data) => {
    return apiCall('put', API_ENDPOINTS.ATTENDANCE.UPDATE, data);
  },
};

