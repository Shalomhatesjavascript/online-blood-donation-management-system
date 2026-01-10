const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BloodRequest = sequelize.define('BloodRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  recipient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  
  blood_group: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  
  units_needed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'At least 1 unit required'
      },
      max: {
        args: [10],
        msg: 'Maximum 10 units per request'
      }
    }
  },
  
  urgency_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  
  hospital_location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'fulfilled', 'rejected'),
    defaultValue: 'pending'
  },
  
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'blood_requests',
  timestamps: true
});

module.exports = BloodRequest;