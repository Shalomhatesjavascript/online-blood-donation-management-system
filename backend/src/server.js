const app = require('./app');
const { testConnection } = require('./config/database');
const syncDatabase = require('./config/syncDatabase');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Step 1: Test database connection
    await testConnection();
    
    // Step 2: Sync database (create tables)
    await syncDatabase();
    
    // Step 3: Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Blood Donation API v1.0`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();