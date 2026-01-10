import api from './api';

export const inventoryService = {
  // Get inventory
  getInventory: async (params) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  // Add blood unit
  addBloodUnit: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  // Update blood unit
  updateBloodUnit: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  // Delete blood unit
  deleteBloodUnit: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get expiring units
  getExpiringUnits: async () => {
    const response = await api.get('/inventory/expiring');
    return response.data;
  },

  // Get stock statistics
  getStockStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  }
};