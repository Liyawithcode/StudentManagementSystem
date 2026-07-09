import { apiCall } from '../redux/api/apiSlice.js';

export const libraryService = {
  getBooks: async () => {
    return apiCall('get', '/library/books');
  },

  addBook: async (bookData) => {
    return apiCall('post', '/library/books', bookData);
  },

  deleteBook: async (id) => {
    return apiCall('delete', `/library/books/${id}`);
  },

  issueBook: async (issueData) => {
    return apiCall('post', '/library/issue', issueData);
  },

  returnBook: async (issueLogId) => {
    return apiCall('post', `/library/return/${issueLogId}`);
  },

  getStats: async () => {
    return apiCall('get', '/library/stats');
  }
};
