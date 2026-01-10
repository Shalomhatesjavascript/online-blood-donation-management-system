// Import all models
const User = require('./User');
const Donor = require('./Donor');
const BloodInventory = require('./BloodInventory');
const BloodRequest = require('./BloodRequest');

// ==========================================
// DEFINE RELATIONSHIPS
// ==========================================

// User <-> Donor (One-to-One)
User.hasOne(Donor, {
  foreignKey: 'donor_id',
  onDelete: 'CASCADE'  // If user deleted, delete donor profile too
});
Donor.belongsTo(User, {
  foreignKey: 'donor_id'
});

// Donor <-> BloodInventory (One-to-Many)
Donor.hasMany(BloodInventory, {
  foreignKey: 'donor_id',
  onDelete: 'SET NULL'  // If donor deleted, keep blood units but set donor_id to NULL
});
BloodInventory.belongsTo(Donor, {
  foreignKey: 'donor_id'
});

// User <-> BloodRequest (One-to-Many)
User.hasMany(BloodRequest, {
  foreignKey: 'recipient_id',
  as: 'requests',  // Alias for accessing: user.requests
  onDelete: 'CASCADE'
});
BloodRequest.belongsTo(User, {
  foreignKey: 'recipient_id',
  as: 'recipient'
});

// Admin approval relationship
User.hasMany(BloodRequest, {
  foreignKey: 'approved_by',
  as: 'approvedRequests',
  onDelete: 'SET NULL'
});
BloodRequest.belongsTo(User, {
  foreignKey: 'approved_by',
  as: 'admin'
});

// ==========================================
// EXPORT ALL MODELS
// ==========================================

module.exports = {
  User,
  Donor,
  BloodInventory,
  BloodRequest
};