const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  complaint_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Subject is required'
      }
    }
  },
  
  category: {
    type: DataTypes.ENUM(
      'blood_quality',
      'service_delay',
      'staff_conduct',
      'system_issue',
      'donor_availability',
      'request_processing',
      'other'
    ),
    allowNull: false,
    defaultValue: 'other'
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description is required'
      }
    }
  },
  
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  
  status: {
    type: DataTypes.ENUM('pending', 'under_review', 'resolved', 'closed'),
    defaultValue: 'pending'
  },
  
  admin_response: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  responded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  
  responded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'complaints',
  timestamps: true
});

module.exports = Complaint;