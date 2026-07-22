import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const teacherService = {
  getAllTeachers: async () => {
    return apiCall('get', API_ENDPOINTS.TEACHERS.BASE);
  },

  getTeacherById: async (id) => {
    if (!id || id === 'null' || id === 'undefined') return { faculty: null };
    return apiCall('get', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`);
  },

  updateTeacher: async (id, data) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid teacher ID');
    return apiCall('put', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`, data);
  },

  deleteTeacher: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid teacher ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.TEACHERS.BASE}/${id}`);
  },

  allocateSubject: async (data) => {
    return apiCall('post', API_ENDPOINTS.TEACHERS.ALLOCATE_SUBJECT, data);
  },

  getSchedules: async (facultyId) => {
    if (!facultyId || facultyId === 'null' || facultyId === 'undefined') return { schedules: [] };
    return apiCall('get', API_ENDPOINTS.TEACHERS.SCHEDULES(facultyId));
  },

  applyLeave: async (data) => {
    return apiCall('post', API_ENDPOINTS.TEACHERS.LEAVE, data);
  },

  getLeaveRequests: async (facultyId) => {
    if (!facultyId || facultyId === 'null' || facultyId === 'undefined') return { requests: [] };
    return apiCall('get', API_ENDPOINTS.TEACHERS.LEAVE_HISTORY(facultyId));
  },

};
