import { apiCall } from '../redux/api/apiSlice.js';
import { API_ENDPOINTS } from '../config/api.js';
import axiosInstance from '../config/axios.js';

export const receiptService = {
  getReceiptByPaymentId: async (paymentId) => {
    return apiCall('get', `${API_ENDPOINTS.RECEIPT.BASE}/${paymentId}`);
  },

  downloadReceiptPDF: async (paymentId, receiptNumber) => {
    try {
      const response = await axiosInstance({
        url: `${API_ENDPOINTS.RECEIPT.BASE}/download/${paymentId}`,
        method: 'GET',
        responseType: 'blob', // Important for handling binary files
      });

      // Create a blob URL and trigger download
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', `Receipt-${receiptNumber || paymentId}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
      return { success: true };
    } catch (error) {
      console.error('PDF download error:', error);
      throw new Error(error.response?.data?.message || 'Failed to download receipt PDF file');
    }
  },
};
