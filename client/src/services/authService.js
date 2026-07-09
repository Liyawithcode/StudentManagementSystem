import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const authService = {
  login: async (email, password) => {
    return apiCall('post', API_ENDPOINTS.AUTH.LOGIN, { email, password });
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

  verifyOtp: async (email, otp, role) => {
    return apiCall('post', API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp, role });
  },

  resendOtp: async (email, role) => {
    return apiCall('post', API_ENDPOINTS.AUTH.RESEND_OTP, { email, role });
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

  resetPassword: async (email, otp, password) => {
    return apiCall('post', API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, otp, password });
  },
};
