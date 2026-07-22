import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const examService = {
  // Exams Schedules
  getExamSchedules: async () => {
    return apiCall('get', API_ENDPOINTS.EXAMS.SCHEDULES);
  },

  scheduleExam: async (data) => {
    return apiCall('post', API_ENDPOINTS.EXAMS.SCHEDULES, data);
  },

  deleteExamSchedule: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid exam schedule ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.EXAMS.SCHEDULES}/${id}`);
  },

  // Marks Entry
  enterMarks: async (data) => {
    return apiCall('post', API_ENDPOINTS.RESULTS.MARKS, data);
  },

  // Results
  getAllResults: async () => {
    return apiCall('get', API_ENDPOINTS.RESULTS.BASE);
  },

  getResultByStudent: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') return { results: [] };
    return apiCall('get', API_ENDPOINTS.RESULTS.STUDENT(studentId));
  },

  addResult: async (data) => {
    return apiCall('post', API_ENDPOINTS.RESULTS.BASE, data);
  },

  updateResult: async (id, data) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid result ID');
    return apiCall('put', `${API_ENDPOINTS.RESULTS.BASE}/${id}`, data);
  },

  deleteResult: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid result ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.RESULTS.BASE}/${id}`);
  },


  // Grading
  getGradingScale: async () => {
    return apiCall('get', API_ENDPOINTS.RESULTS.GRADING);
  },

  updateGradingScale: async (data) => {
    return apiCall('put', API_ENDPOINTS.RESULTS.GRADING, data);
  },

  generateCertificate: async (data) => {
    return apiCall('post', API_ENDPOINTS.RESULTS.CERTIFICATE, data);
  },
};
