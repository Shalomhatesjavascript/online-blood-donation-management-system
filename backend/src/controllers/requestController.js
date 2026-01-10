const { BloodRequest, User, BloodInventory } = require('../models');
const { sequelize } = require('../config/database');

// Get all requests (filtered by role)
exports.getRequests = async (req, res) => {
  try {
    const { status, urgency_level } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (urgency_level) whereClause.urgency_level = urgency_level;

    // Recipients only see their own requests
    if (req.user.role === 'recipient') {
      whereClause.recipient_id = req.user.user_id;
    }

    const requests = await BloodRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['email', 'user_id']
        },
        {
          model: User,
          as: 'admin',
          attributes: ['email']
        }
      ],
      order: [['urgency_level', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
};

// Create new request
exports.createRequest = async (req, res) => {
  try {
    const { blood_group, units_needed, urgency_level, hospital_location } = req.body;

    const request = await BloodRequest.create({
      recipient_id: req.user.user_id,
      blood_group,
      units_needed,
      urgency_level,
      hospital_location,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
};

// Approve request
exports.approveRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const request = await BloodRequest.findByPk(id);
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    // Check inventory availability
    const availableUnits = await BloodInventory.count({
      where: {
        blood_group: request.blood_group,
        status: 'available'
      }
    });

    if (availableUnits < request.units_needed) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${availableUnits}, Needed: ${request.units_needed}`
      });
    }

    // Update request status
    request.status = 'approved';
    request.approved_by = req.user.user_id;
    request.approved_at = new Date();
    request.admin_notes = admin_notes || '';
    await request.save({ transaction });

    // Mark blood units as used
    const unitsToUse = await BloodInventory.findAll({
      where: {
        blood_group: request.blood_group,
        status: 'available'
      },
      limit: request.units_needed,
      order: [['expiration_date', 'ASC']],
      transaction
    });

    for (const unit of unitsToUse) {
      unit.status = 'used';
      await unit.save({ transaction });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: request
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
      error: error.message
    });
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const request = await BloodRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    request.status = 'rejected';
    request.approved_by = req.user.user_id;
    request.admin_notes = admin_notes || 'Request rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: error.message
    });
  }
};

// Cancel request (recipient only)
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership
    if (request.recipient_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled'
      });
    }

    await request.destroy();

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel request',
      error: error.message
    });
  }
};