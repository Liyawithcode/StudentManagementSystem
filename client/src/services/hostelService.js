import { apiCall } from '../redux/api/apiSlice.js';

export const hostelService = {
  getHostelSummary: async () => {
    return apiCall('get', '/hostels/summary');
  },

  getRooms: async () => {
    return apiCall('get', '/hostels/rooms');
  },

  createRoom: async (roomData) => {
    return apiCall('post', '/hostels/rooms', roomData);
  },

  allocateRoom: async (roomId, studentId) => {
    return apiCall('post', `/hostels/rooms/allocate/${roomId}`, { studentId });
  },

  vacateRoom: async (roomId) => {
    return apiCall('post', `/hostels/rooms/vacate/${roomId}`);
  }
};
