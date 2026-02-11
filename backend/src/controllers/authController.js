const { User, Donor } = require('../models');
const jwtConfig = require('../config/jwt');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

// Register new user
exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { email, password, role, full_name, age, gender, blood_group, phone, address, city, state, medical_history } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password_hash: password,
      role,
      verification_token: verificationToken
    }, { transaction });

    // If donor, create donor profile
    if (role === 'donor') {
      await Donor.create({
        donor_id: user.user_id,
        full_name,
        age,
        gender,
        blood_group,
        phone,
        address,
        city,
        state,
        medical_history: medical_history || {}
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user_id: user.user_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwtConfig.generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toSafeJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    // If donor, include donor details
    if (user.role === 'donor') {
      const donor = await Donor.findByPk(user.user_id);
      return res.status(200).json({
        success: true,
        data: {
          ...user.toSafeJSON(),
          donor_profile: donor
        }
      });
    }

    res.status(200).json({
      success: true,
      data: user.toSafeJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
};

// Logout (optional - client-side token removal)
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};