// Import Sequelize (ORM for PostgreSQL)
const { Sequelize } = require('sequelize');

// Load environment variables
require('dotenv').config();

// Create Sequelize instance with database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name: blood_donation_db
  process.env.DB_USER,      // Database user: postgres
  process.env.DB_PASSWORD,  // Your postgres password
  {
    host: process.env.DB_HOST,  // Usually localhost
    port: process.env.DB_PORT,  // Default: 5432
    dialect: 'postgres',         // Tell Sequelize we're using PostgreSQL
    
    // Logging configuration
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // ^ Shows SQL queries in console during development, hides in production
    
    // Connection pool settings (manages multiple simultaneous connections)
    pool: {
      max: 5,        // Maximum 5 connections at once
      min: 0,        // Minimum 0 connections (creates as needed)
      acquire: 30000, // Max time (ms) to get connection before error
      idle: 10000    // Max time (ms) connection can be idle before release
    },
    
    // Timezone settings
    timezone: '+01:00',  // Nigeria timezone (WAT - West Africa Time)
    
    // Model options
    define: {
      timestamps: true,      // Auto-add createdAt, updatedAt columns
      underscored: false,    // Use camelCase (not snake_case) for columns
      freezeTableName: true  // Don't pluralize table names (User not Users)
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1); // Exit app if database connection fails
  }
};

// Export sequelize instance and test function
module.exports = { sequelize, testConnection };