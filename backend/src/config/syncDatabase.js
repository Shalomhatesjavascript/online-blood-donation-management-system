const { sequelize } = require('./database');
const { User, Donor, BloodInventory, BloodRequest } = require('../models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Synchronizing database...');
    
    // force: false = Don't drop existing tables
    // alter: true = Update tables to match models (add missing columns)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    throw error;
  }
};

module.exports = syncDatabase;