import api from './api';

export const donorService = {
  // Search donors (for recipients)
  searchDonors: async (params) => {
    const response = await api.get('/donors/search', { params });
    return response.data;
  },

  // Get all donors (for admin)
  getAllDonors: async (params) => {
    const response = await api.get('/donors/all', { params });
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

  // Update donation date (admin only)
  updateDonationDate: async (id, date) => {
    const response = await api.put(`/donors/${id}/donation-date`, {
      last_donation_date: date
    });
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