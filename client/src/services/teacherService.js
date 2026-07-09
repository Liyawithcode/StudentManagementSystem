import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const teacherService = {
  getAllTeachers: async () => {
    return apiCall('get', API_ENDPOINTS.TEACHERS.BASE);
  },

  getTeacherById: async (id) => {
    return apiCall('get', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`);
  },

  updateTeacher: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`, data);
  },

  deleteTeacher: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`);
  },

  allocateSubject: async (data) => {
    return apiCall('post', API_ENDPOINTS.TEACHERS.ALLOCATE_SUBJECT, data);
  },

  getSchedules: async (facultyId) => {
    return apiCall('get', API_ENDPOINTS.TEACHERS.SCHEDULES(facultyId));
  },

  applyLeave: async (data) => {
    return apiCall('post', API_ENDPOINTS.TEACHERS.LEAVE, data);
  },

  getLeaveRequests: async (facultyId) => {
    return apiCall('get', API_ENDPOINTS.TEACHERS.LEAVE_HISTORY(facultyId));
  },
};
