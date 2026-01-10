import api from './api';

export const requestService = {
  // Get requests
  getRequests: async (params) => {
    const response = await api.get('/requests', { params });
    return response.data;
  },

  // Create request
  createRequest: async (data) => {
    const response = await api.post('/requests', data);
    return response.data;
  },

  // Approve request
  approveRequest: async (id, data) => {
    const response = await api.put(`/requests/${id}/approve`, data);
    return response.data;
  },

  // Reject request
  rejectRequest: async (id, data) => {
    const response = await api.put(`/requests/${id}/reject`, data);
    return response.data;
  },

  // Cancel request
  cancelRequest: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  }
};