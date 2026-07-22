import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const studentService = {
  getAllStudents: async () => {
    return apiCall('get', API_ENDPOINTS.STUDENTS.BASE);
  },

  getStudentById: async (id) => {
    if (!id || id === 'null' || id === 'undefined') return { student: null };
    return apiCall('get', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`);
  },

  updateStudent: async (id, data) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid student ID');
    return apiCall('put', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`, data);
  },

  deleteStudent: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid student ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.STUDENTS.BASE}/${id}`);
  },

  promoteToAlumni: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.PROMOTE, data);
  },

  enrollStudent: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.ENROLL, data);
  },

  getEnrollmentHistory: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') return { history: [] };
    return apiCall('get', API_ENDPOINTS.STUDENTS.ENROLLMENT_HISTORY(studentId));
  },

  applyLeave: async (data) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.LEAVE, data);
  },

  getLeaveRequests: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') return { requests: [] };
    return apiCall('get', API_ENDPOINTS.STUDENTS.LEAVE_HISTORY(studentId));
  },

};
