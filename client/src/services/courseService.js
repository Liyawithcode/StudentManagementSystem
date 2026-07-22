import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const courseService = {
  // Courses
  getAllCourses: async () => {
    return apiCall('get', API_ENDPOINTS.COURSES.BASE);
  },
  getCourseByCode: async (code) => {
    return apiCall('get', `${API_ENDPOINTS.COURSES.BASE}/code/${code}`);
  },
  createCourse: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.BASE, data);
  },
  updateCourse: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.COURSES.BASE}/${id}`, data);
  },
  deleteCourse: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid course ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.COURSES.BASE}/${id}`);
  },

  // Subjects
  getSubjects: async () => {
    return apiCall('get', API_ENDPOINTS.COURSES.SUBJECTS);
  },
  createSubject: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.SUBJECTS, data);
  },
  deleteSubject: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid subject ID for deletion');
    return apiCall('delete', `${API_ENDPOINTS.COURSES.SUBJECTS}/${id}`);
  },


  // Classes
  getClasses: async () => {
    return apiCall('get', API_ENDPOINTS.COURSES.CLASSES);
  },
  createClass: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.CLASSES, data);
  },
  deleteClass: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.COURSES.CLASSES}/${id}`);
  },

  // Batches
  getBatches: async () => {
    return apiCall('get', API_ENDPOINTS.COURSES.BATCHES);
  },
  createBatch: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.BATCHES, data);
  },
  deleteBatch: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.COURSES.BATCHES}/${id}`);
  },

  // Sections
  getSections: async () => {
    return apiCall('get', API_ENDPOINTS.COURSES.SECTIONS);
  },
  createSection: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.SECTIONS, data);
  },
  deleteSection: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.COURSES.SECTIONS}/${id}`);
  },

  // Timetable
  getTimetable: async (params) => {
    if (params && typeof params === 'object') {
      const query = new URLSearchParams(params).toString();
      return apiCall('get', `${API_ENDPOINTS.COURSES.TIMETABLE}?${query}`);
    }
    return apiCall('get', `${API_ENDPOINTS.COURSES.TIMETABLE}?className=${params}`);
  },
  createTimetable: async (data) => {
    return apiCall('post', API_ENDPOINTS.COURSES.TIMETABLE, data);
  },
  deleteTimetable: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.COURSES.TIMETABLE}/${id}`);
  },
};
