import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const authService = {
  login: async (email, password, role) => {
    return apiCall('post', API_ENDPOINTS.AUTH.LOGIN, { email, password, role });
  },
  
  registerAdmin: async (adminData) => {
    return apiCall('post', API_ENDPOINTS.ADMIN.REGISTER, adminData);
  },

  registerStudent: async (studentData) => {
    return apiCall('post', API_ENDPOINTS.STUDENTS.REGISTER, studentData);
  },

  registerTeacher: async (teacherData) => {
    return apiCall('post', API_ENDPOINTS.TEACHERS.REGISTER, teacherData);
  },



  googleLogin: async (idToken, role) => {
    return apiCall('post', '/auth/google-login', { idToken, role });
  },

  logout: async () => {
    return apiCall('post', API_ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return apiCall('get', API_ENDPOINTS.AUTH.PROFILE);
  },

  updateProfile: async (data) => {
    return apiCall('put', API_ENDPOINTS.AUTH.PROFILE, data);
  },

  forgotPassword: async (email) => {
    return apiCall('post', API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (email, password) => {
    return apiCall('post', API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, password });
  },
};
