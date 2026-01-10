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
// Add new blood unit
exports.addBloodUnit = async (req, res) => {
  try {
    const { blood_group, donation_date, expiration_date, donor_id, storage_location } = req.body;

    console.log('📥 Received data:', { blood_group, donation_date, expiration_date, donor_id, storage_location });

    // Calculate expiration date if not provided (35 days from donation)
    let calculatedExpirationDate = expiration_date;
    if (!calculatedExpirationDate) {
      const donationDateObj = donation_date ? new Date(donation_date) : new Date();
      donationDateObj.setDate(donationDateObj.getDate() + 35);
      calculatedExpirationDate = donationDateObj.toISOString().split('T')[0];
    }

    // Prepare data for creation
    const dataToCreate = {
      blood_group,
      donation_date: donation_date || new Date().toISOString().split('T')[0],
      expiration_date: calculatedExpirationDate,
      storage_location,
      status: 'available'
    };

    // Only add donor_id if it exists and is valid
    if (donor_id && !isNaN(parseInt(donor_id))) {
      dataToCreate.donor_id = parseInt(donor_id);
    } else {
      dataToCreate.donor_id = null;
    }

    console.log('💾 Creating unit with data:', dataToCreate);

    const unit = await BloodInventory.create(dataToCreate);

    console.log('✅ Unit created successfully:', unit.unit_id);

    res.status(201).json({
      success: true,
      message: 'Blood unit added successfully',
      data: unit
    });
  } catch (error) {
    console.error('❌ Add blood unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add blood unit',
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