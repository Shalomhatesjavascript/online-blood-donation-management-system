import api from './api';

export const donorService = {
  // Search donors
  searchDonors: async (params) => {
    const response = await api.get('/donors', { params });
    return response.data;
  },

  // Get donor by ID
  getDonorById: async (id) => {
    const response = await api.get(`/donors/${id}`);
    return response.data;
  },

  // Update donor profile
  updateDonor: async (id, data) => {
    const response = await api.put(`/donors/${id}`, data);
    return response.data;
  },

  // Get donation history
  getDonationHistory: async (id) => {
    const response = await api.get(`/donors/${id}/history`);
    return response.data;
  },

  // Get eligible donors
  getEligibleDonors: async () => {
    const response = await api.get('/donors/eligible');
    return response.data;
  }
};