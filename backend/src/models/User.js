const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

// Define User model (maps to 'users' table in database)
const User = sequelize.define('User', {
  // Primary key (auto-increment)
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Email (unique, required)
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'Email address already exists'  // Custom error message
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  
  // Password (hashed, required)
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  
  // User role (donor, recipient, or admin)
  role: {
    type: DataTypes.ENUM('donor', 'recipient', 'admin'),
    allowNull: false,
    defaultValue: 'donor'
  },
  
  // Email verification status
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Verification token (for email confirmation)
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'users',  // Explicit table name
  timestamps: true      // Adds createdAt, updatedAt
});

// ==========================================
// INSTANCE METHODS (methods called on user objects)
// ==========================================

// Method to check if password matches
// Usage: const isMatch = await user.comparePassword('password123');
User.prototype.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to convert user to safe JSON (hide password)
// Usage: res.json({ user: user.toSafeJSON() });
User.prototype.toSafeJSON = function() {
  const values = { ...this.get() };
  delete values.password_hash;      // Remove password
  delete values.verification_token;  // Remove token
  return values;
};

// ==========================================
// HOOKS (automatically run before/after operations)
// ==========================================

// Before creating user, hash the password
User.beforeCreate(async (user) => {
  if (user.password_hash) {
    const salt = await bcrypt.genSalt(10);  // Generate salt (random string)
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

// Before updating user, hash password if it changed
User.beforeUpdate(async (user) => {
  if (user.changed('password_hash')) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

module.exports = User;