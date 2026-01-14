const { BloodInventory, Donor } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database'); // ADD THIS LINE

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
// Add new blood unit (WITH COMPREHENSIVE ERROR HANDLING)
exports.addBloodUnit = async (req, res) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    
    const { blood_group, donation_date, expiration_date, donor_id, storage_location } = req.body;

    console.log('📝 Received data:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!blood_group) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Blood group is required'
      });
    }

    if (!storage_location) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Storage location is required'
      });
    }

    // Prepare donation date
    const finalDonationDate = donation_date || new Date();
    console.log('📅 Donation date:', finalDonationDate);

    // Calculate expiration date if not provided
    let finalExpirationDate = expiration_date;
    if (!finalExpirationDate) {
      const expDate = new Date(finalDonationDate);
      expDate.setDate(expDate.getDate() + 35);
      finalExpirationDate = expDate.toISOString().split('T')[0];
      console.log('🗓️ Auto-calculated expiration:', finalExpirationDate);
    }

    // Validate donor exists if donor_id provided
    if (donor_id) {
      console.log('👤 Checking donor:', donor_id);
      const donorExists = await Donor.findByPk(donor_id);
      if (!donorExists) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Donor with ID ${donor_id} not found`
        });
      }
      console.log('✅ Donor found:', donorExists.full_name);
    }

    // Create blood unit
    console.log('🩸 Creating blood unit...');
    const unit = await BloodInventory.create({
      blood_group,
      donation_date: finalDonationDate,
      expiration_date: finalExpirationDate,
      donor_id: donor_id || null,
      storage_location,
      status: 'available'
    }, { transaction });

    console.log('✅ Blood unit created with ID:', unit.unit_id);

    // Update donor's last_donation_date if donor_id provided
    if (donor_id) {
      console.log('📝 Updating donor last donation date...');
      const updateResult = await Donor.update(
        { last_donation_date: finalDonationDate },
        { 
          where: { donor_id },
          transaction 
        }
      );
      console.log('✅ Donor update result:', updateResult);
    }

    await transaction.commit();
    console.log('✅ Transaction committed successfully');

    res.status(201).json({
      success: true,
      message: 'Blood unit added successfully' + (donor_id ? ' and donor record updated' : ''),
      data: unit
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    
    // Log complete error details
    console.error('❌ ========================================');
    console.error('❌ ADD BLOOD UNIT ERROR:');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    if (error.errors) {
      console.error('❌ Validation errors:', error.errors.map(e => ({
        field: e.path,
        message: e.message,
        type: e.type
      })));
    }
    
    if (error.original) {
      console.error('❌ Database error:', error.original.message);
    }
    console.error('❌ ========================================');
    
    // Send detailed error to frontend
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add blood unit',
      error: error.name,
      details: error.errors ? error.errors.map(e => e.message).join(', ') : error.message
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