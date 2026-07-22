import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';

export const feeService = {
  getAllFees: async () => {
    return apiCall('get', API_ENDPOINTS.FEES.BASE);
  },

  createFee: async (data) => {
    return apiCall('post', API_ENDPOINTS.FEES.BASE, data);
  },

  // ✅ Correct endpoint: PUT /api/fees/:id → updates the fee STRUCTURE
  updateFeeStructure: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.FEES.BASE}/${id}`, data);
  },

  // Legacy: PUT /api/fees/payment/:id → updates a student payment record status
  updatePayment: async (id, data) => {
    return apiCall('put', `${API_ENDPOINTS.FEES.PAYMENT}/${id}`, data);
  },

  getFeesByStudent: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') {
      return { fees: [] };
    }
    return apiCall('get', API_ENDPOINTS.FEES.STUDENT(studentId));
  },

  deleteFee: async (id) => {
    return apiCall('delete', `${API_ENDPOINTS.FEES.BASE}/${id}`);
  },

  getInvoice: async (invoiceId) => {
    if (!invoiceId || invoiceId === 'null' || invoiceId === 'undefined') {
      return { invoice: null };
    }
    return apiCall('get', API_ENDPOINTS.FEES.INVOICE(invoiceId));
  },


  recordPayment: async (data) => {
    return apiCall('post', API_ENDPOINTS.FEES.RECORD_PAYMENT, data);
  },
};
