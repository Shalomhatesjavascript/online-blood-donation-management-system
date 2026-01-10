const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BloodInventory = sequelize.define('BloodInventory', {
  unit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  blood_group: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  
  donation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  expiration_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  
  status: {
    type: DataTypes.ENUM('available', 'used', 'expired', 'discarded'),
    defaultValue: 'available'
  },
  
  donor_id: {
  type: DataTypes.INTEGER,
  allowNull: true,  // Make sure this is true
  references: {
    model: 'donors',
    key: 'donor_id'
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
},
  storage_location: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'blood_inventory',
  timestamps: true
});

// ==========================================
// HOOKS
// ==========================================

// Automatically calculate expiration date if not provided
BloodInventory.beforeCreate(async (unit) => {
  // Only calculate if expiration_date is not provided
  if (!unit.expiration_date) {
    const donationDate = unit.donation_date ? new Date(unit.donation_date) : new Date();
    const expirationDate = new Date(donationDate);
    expirationDate.setDate(expirationDate.getDate() + 35);
    unit.expiration_date = expirationDate.toISOString().split('T')[0];
  }
});

// ==========================================
// INSTANCE METHODS
// ==========================================

// Check if unit is expiring soon (within 7 days)
BloodInventory.prototype.isExpiringSoon = function() {
  const today = new Date();
  const expiration = new Date(this.expiration_date);
  const daysUntilExpiration = Math.floor((expiration - today) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
};

// Check if unit is expired
BloodInventory.prototype.isExpired = function() {
  const today = new Date();
  const expiration = new Date(this.expiration_date);
  
  return today > expiration;
};

module.exports = BloodInventory;