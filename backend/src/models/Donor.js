const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donor = sequelize.define('Donor', {
  // Foreign key linking to User
  donor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',    // Links to users table
      key: 'user_id'
    }
  },
  
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [2, 255],
        msg: 'Name must be between 2 and 255 characters'
      }
    }
  },
  
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [18],
        msg: 'Donor must be at least 18 years old'
      },
      max: {
        args: [65],
        msg: 'Donor must be under 65 years old'
      }
    }
  },
  
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  
  blood_group: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: {
        args: /^[0-9+\-() ]+$/,  // Allows digits, +, -, (), spaces
        msg: 'Please provide a valid phone number'
      }
    }
  },
  
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  
  last_donation_date: {
    type: DataTypes.DATEONLY,  // Only date (no time)
    allowNull: true
  },
  
  // Store medical history as JSON
  medical_history: {
    type: DataTypes.JSONB,  // JSONB is faster than JSON in PostgreSQL
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'donors',
  timestamps: true
});

// ==========================================
// VIRTUAL FIELDS (computed, not stored in database)
// ==========================================

// Check if donor is eligible (56 days since last donation)
Donor.prototype.isEligible = function() {
  if (!this.last_donation_date) {
    return true;  // Never donated before = eligible
  }
  
  const today = new Date();
  const lastDonation = new Date(this.last_donation_date);
  const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
  
  return daysSinceLastDonation >= 56;  // WHO guideline: 56 days minimum
};

// Get days until next eligible donation
Donor.prototype.daysUntilEligible = function() {
  if (!this.last_donation_date) {
    return 0;  // Already eligible
  }
  
  const today = new Date();
  const lastDonation = new Date(this.last_donation_date);
  const daysSince = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 56 - daysSince);
};

module.exports = Donor;