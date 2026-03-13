import api from './api';

export const complaintService = {
  // Get all complaints
  getComplaints: async (params) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Create complaint
  createComplaint: async (data) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  // Admin: Respond to complaint
  respondToComplaint: async (id, data) => {
    const response = await api.put(`/complaints/${id}/respond`, data);
    return response.data;
  },

  // Update complaint status
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  }
};