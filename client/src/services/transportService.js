import { apiCall } from '../redux/api/apiSlice.js';

export const transportService = {
  getRoutes: async () => {
    return apiCall('get', '/transport/routes');
  },

  createRoute: async (routeData) => {
    return apiCall('post', '/transport/routes', routeData);
  },

  deleteRoute: async (id) => {
    return apiCall('delete', `/transport/routes/${id}`);
  },

  assignStudent: async (routeNumber, studentId) => {
    return apiCall('post', '/transport/assign', { routeNumber, studentId });
  },

  getStudentRoute: async (studentId) => {
    return apiCall('get', `/transport/student/${studentId}`);
  },

  getVehicles: async () => {
    return apiCall('get', '/transport/vehicles');
  },

  updateVehicle: async (id, vehicleData) => {
    return apiCall('put', `/transport/vehicles/${id}`, vehicleData);
  }
};
