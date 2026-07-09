import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const feeService = {
  getAllFees: async () => {
    return apiCall('get', API_ENDPOINTS.FEES.BASE);
  },

  createFee: async (data) => {
    return apiCall('post', API_ENDPOINTS.FEES.BASE, data);
  },

  getFeesByStudent: async (studentId) => {
    return apiCall('get', API_ENDPOINTS.FEES.STUDENT(studentId));
  },

  updatePayment: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.FEES.PAYMENT}/${id}`, data);
  },

  deleteFee: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.FEES.BASE}/${id}`);
  },

  getInvoice: async (invoiceId) => {
    return apiCall('get', API_ENDPOINTS.FEES.INVOICE(invoiceId));
  },

  recordPayment: async (data) => {
    return apiCall('post', API_ENDPOINTS.FEES.RECORD_PAYMENT, data);
  },
};
