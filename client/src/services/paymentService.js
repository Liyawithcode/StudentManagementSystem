import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const paymentService = {
  getAllPayments: async () => {
    return apiCall('get', API_ENDPOINTS.PAYMENTS.BASE);
  },

  getPaymentById: async (id) => {
    if (!id || id === 'null' || id === 'undefined') {
      return { payment: null };
    }
    return apiCall('get', `${API_ENDPOINTS.PAYMENTS.BASE}/${id}`);
  },

  getPaymentsByStudentId: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') {
      return { payments: [] };
    }
    return apiCall('get', API_ENDPOINTS.PAYMENTS.STUDENT(studentId));
  },


  createOrder: async (data) => {
    return apiCall('post', API_ENDPOINTS.PAYMENTS.CREATE_ORDER, data);
  },

  verifyPayment: async (data) => {
    return apiCall('post', API_ENDPOINTS.PAYMENTS.VERIFY, data);
  },

  recordOfflinePayment: async (data) => {
    return apiCall('post', API_ENDPOINTS.PAYMENTS.OFFLINE, data);
  },

  updatePaymentStatus: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.PAYMENTS.BASE}/${id}`, data);
  },

  deletePayment: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.PAYMENTS.BASE}/${id}`);
  },

  refundPayment: async (data) => {
    return apiCall('post', API_ENDPOINTS.PAYMENTS.REFUND, data);
  },
};
