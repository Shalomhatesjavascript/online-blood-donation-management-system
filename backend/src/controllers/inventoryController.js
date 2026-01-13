const { BloodInventory, Donor } = require('../models');
const { Op } = require('sequelize');

// Get all inventory with filters
exports.getInventory = async (req, res) => {
  try {
    const { blood_group, status, expiring_soon } = req.query;

    const whereClause = {};
    if (blood_group) whereClause.blood_group = blood_group;
    if (status) whereClause.status = status;

    let units = await BloodInventory.findAll({
      where: whereClause,
      include: [{
        model: Donor,
        attributes: ['full_name', 'phone']
      }],
      order: [['expiration_date', 'ASC']]
    });

    // Filter expiring soon if requested
    if (expiring_soon === 'true') {
      units = units.filter(unit => unit.isExpiringSoon());
    }

    res.status(200).json({
      success: true,
      count: units.length,
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

// Add new blood unit
exports.addBloodUnit = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { blood_group, donation_date, expiration_date, donor_id, storage_location } = req.body;

    // Create blood unit
    const unit = await BloodInventory.create({
      blood_group,
      donation_date: donation_date || new Date(),
      expiration_date,
      donor_id,
      storage_location,
      status: 'available'
    }, { transaction });

    // If donor_id provided, update donor's last_donation_date
    if (donor_id) {
      await Donor.update(
        { last_donation_date: donation_date || new Date() },
        { where: { donor_id }, transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Blood unit added successfully' + (donor_id ? ' and donor record updated' : ''),
      data: unit
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to add blood unit',
      error: error.message
    });
  }
};

// Add new endpoint for manually updating donor's last donation date
exports.updateDonorDonationDate = async (req, res) => {
  try {
    const { donor_id, last_donation_date } = req.body;

    const donor = await Donor.findByPk(donor_id);
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
      message: 'Donor donation date updated successfully',
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update donation date',
      error: error.message
    });
  }
};
// Update blood unit
exports.updateBloodUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, storage_location } = req.body;

    const unit = await BloodInventory.findByPk(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Blood unit not found'
      });
    }

    if (status) unit.status = status;
    if (storage_location) unit.storage_location = storage_location;

    await unit.save();

    res.status(200).json({
      success: true,
      message: 'Blood unit updated successfully',
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blood unit',
      error: error.message
    });
  }
};

// Delete blood unit
exports.deleteBloodUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await BloodInventory.findByPk(id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Blood unit not found'
      });
    }

    await unit.destroy();

    res.status(200).json({
      success: true,
      message: 'Blood unit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blood unit',
      error: error.message
    });
  }
};

// Get expiring units
exports.getExpiringUnits = async (req, res) => {
  try {
    const units = await BloodInventory.findAll({
      where: {
        status: 'available'
      },
      include: [{
        model: Donor,
        attributes: ['full_name']
      }],
      order: [['expiration_date', 'ASC']]
    });

    const expiringUnits = units.filter(unit => unit.isExpiringSoon());

    res.status(200).json({
      success: true,
      count: expiringUnits.length,
      data: expiringUnits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expiring units',
      error: error.message
    });
  }
};

// Get stock statistics
exports.getStockStats = async (req, res) => {
  try {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    const stats = await Promise.all(
      bloodGroups.map(async (group) => {
        const count = await BloodInventory.count({
          where: {
            blood_group: group,
            status: 'available'
          }
        });
        
        return {
          blood_group: group,
          available_units: count,
          status: count < 5 ? 'low' : count < 10 ? 'medium' : 'good'
        };
      })
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock statistics',
      error: error.message
    });
  }
};