const { Donor, User, BloodInventory } = require('../models');
const { Op } = require('sequelize');

// Search donors
exports.searchDonors = async (req, res) => {
  try {
    const { blood_group, city, state, eligible_only } = req.query;

    const whereClause = {};
    if (blood_group) whereClause.blood_group = blood_group;
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (state) whereClause.state = { [Op.iLike]: `%${state}%` };

    let donors = await Donor.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['email', 'is_verified']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Filter by eligibility if requested
    if (eligible_only === 'true') {
      donors = donors.filter(donor => donor.isEligible());
    }

    // Add eligibility status to each donor
    const donorsWithEligibility = donors.map(donor => ({
      ...donor.toJSON(),
      is_eligible: donor.isEligible(),
      days_until_eligible: donor.daysUntilEligible()
    }));

    res.status(200).json({
      success: true,
      count: donorsWithEligibility.length,
      data: donorsWithEligibility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search donors',
      error: error.message
    });
  }
};

// Get donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findByPk(id, {
      include: [{
        model: User,
        attributes: ['email', 'is_verified', 'createdAt']
      }]
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...donor.toJSON(),
        is_eligible: donor.isEligible(),
        days_until_eligible: donor.daysUntilEligible()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donor',
      error: error.message
    });
  }
};

// Update donor profile
exports.updateDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, age, phone, address, city, state, medical_history, last_donation_date } = req.body;

    // Check authorization (donor can only update own profile, admin can update any)
    if (req.user.role === 'donor' && parseInt(id) !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    const donor = await Donor.findByPk(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Update fields
    if (full_name) donor.full_name = full_name;
    if (age) donor.age = age;
    if (phone) donor.phone = phone;
    if (address) donor.address = address;
    if (city) donor.city = city;
    if (state) donor.state = state;
    if (medical_history) donor.medical_history = medical_history;
    if (last_donation_date) donor.last_donation_date = last_donation_date;

    await donor.save();

    res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully',
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update donor',
      error: error.message
    });
  }
};

// Get donor donation history
exports.getDonationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const donations = await BloodInventory.findAll({
      where: { donor_id: id },
      order: [['donation_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation history',
      error: error.message
    });
  }
};

// Get all eligible donors
exports.getEligibleDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      include: [{
        model: User,
        attributes: ['email', 'is_verified']
      }]
    });

    const eligibleDonors = donors.filter(donor => donor.isEligible());

    res.status(200).json({
      success: true,
      count: eligibleDonors.length,
      data: eligibleDonors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligible donors',
      error: error.message
    });
  }
};

// Get all donors (admin only)
exports.getAllDonors = async (req, res) => {
  try {
    const { blood_group, city, state, eligible_only, search } = req.query;

    const whereClause = {};
    if (blood_group) whereClause.blood_group = blood_group;
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (state) whereClause.state = { [Op.iLike]: `%${state}%` };
    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let donors = await Donor.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['email', 'is_verified', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Filter by eligibility if requested
    if (eligible_only === 'true') {
      donors = donors.filter(donor => donor.isEligible());
    }

    // Add eligibility status to each donor
    const donorsWithEligibility = donors.map(donor => ({
      ...donor.toJSON(),
      is_eligible: donor.isEligible(),
      days_until_eligible: donor.daysUntilEligible()
    }));

    res.status(200).json({
      success: true,
      count: donorsWithEligibility.length,
      data: donorsWithEligibility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donors',
      error: error.message
    });
  }
};

// Update donor's last donation date (admin only)
exports.updateDonationDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { last_donation_date } = req.body;

    const donor = await Donor.findByPk(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    donor.last_donation_date = last_donation_date;
    await donor.save();

    res.status(200).json({
      success: true,
      message: 'Donation date updated successfully',
      data: {
        ...donor.toJSON(),
        is_eligible: donor.isEligible(),
        days_until_eligible: donor.daysUntilEligible()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update donation date',
      error: error.message
    });
  }
};