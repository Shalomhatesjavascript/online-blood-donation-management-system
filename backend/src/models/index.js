// Import all models
const User = require('./User');
const Donor = require('./Donor');
const BloodInventory = require('./BloodInventory');
const BloodRequest = require('./BloodRequest');
const Complaint = require('./Complaint'); // NEW

// ==========================================
// DEFINE RELATIONSHIPS
// ==========================================

// User <-> Donor (One-to-One)
User.hasOne(Donor, {
  foreignKey: 'donor_id',
  onDelete: 'CASCADE'
});
Donor.belongsTo(User, {
  foreignKey: 'donor_id'
});

// Donor <-> BloodInventory (One-to-Many)
Donor.hasMany(BloodInventory, {
  foreignKey: 'donor_id',
  onDelete: 'SET NULL'
});
BloodInventory.belongsTo(Donor, {
  foreignKey: 'donor_id'
});

// User <-> BloodRequest (One-to-Many)
User.hasMany(BloodRequest, {
  foreignKey: 'recipient_id',
  as: 'requests',
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

// NEW: User <-> Complaint (One-to-Many)
User.hasMany(Complaint, {
  foreignKey: 'user_id',
  as: 'complaints',
  onDelete: 'CASCADE'
});
Complaint.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// NEW: Admin response relationship
User.hasMany(Complaint, {
  foreignKey: 'responded_by',
  as: 'responses',
  onDelete: 'SET NULL'
});
Complaint.belongsTo(User, {
  foreignKey: 'responded_by',
  as: 'admin'
});

// ==========================================
// EXPORT ALL MODELS
// ==========================================

module.exports = {
  User,
  Donor,
  BloodInventory,
  BloodRequest,
  Complaint // NEW
};