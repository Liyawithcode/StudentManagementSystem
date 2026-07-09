import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const studentService = {
  getAllStudents: async () => {
    return apiCall('get', API_ENDPOINTS.STUDENTS.BASE);
  },

  getStudentById: async (id) => {
    return apiCall('get', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`);
  },

  updateStudent: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`, data);
  },

  deleteStudent: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`);
  },

  promoteToAlumni: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.PROMOTE, data);
  },

  enrollStudent: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.ENROLL, data);
  },

  getEnrollmentHistory: async (studentId) => {
    return apiCall('get', API_ENDPOINTS.STUDENTS.ENROLLMENT_HISTORY(studentId));
  },

  applyLeave: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.LEAVE, data);
  },

  getLeaveRequests: async (studentId) => {
    return apiCall('get', API_ENDPOINTS.STUDENTS.LEAVE_HISTORY(studentId));
  },
};
