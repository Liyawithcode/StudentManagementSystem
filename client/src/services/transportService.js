import { apiCall } from '../redux/api/apiSlice.js';

export const transportService = {
  getRoutes: async () => {
    return apiCall('get', '/transport/routes');
  },

  createRoute: async (routeData) => {
    return apiCall('post', '/transport/routes', routeData);
  },

  deleteRoute: async (id) => {
    if (!id || id === 'null' || id === 'undefined') throw new Error('Invalid route ID for deletion');
    return apiCall('delete', `/transport/routes/${id}`);
  },

  assignStudent: async (routeNumber, studentId) => {
    return apiCall('post', '/transport/assign', { routeNumber, studentId });
  },

  getStudentRoute: async (studentId) => {
    if (!studentId || studentId === 'null' || studentId === 'undefined') return { route: null };
    return apiCall('get', `/transport/student/${studentId}`);
  },


  getVehicles: async () => {
    return apiCall('get', '/transport/vehicles');
  },

  updateVehicle: async (id, vehicleData) => {
    return apiCall('put', `/transport/vehicles/${id}`, vehicleData);
  }
};
