const { Complaint, User, Donor } = require('../models');
const { Op } = require('sequelize');

// Get all complaints (filtered by role)
exports.getComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;

    // Non-admins only see their own complaints
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.user_id;
    }

    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'email', 'role'],
          include: [{
            model: Donor,
            attributes: ['full_name', 'phone']
          }]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['user_id', 'email']
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
};

// Create new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { subject, category, description, priority } = req.body;

    const complaint = await Complaint.create({
      user_id: req.user.user_id,
      subject,
      category,
      description,
      priority: priority || 'medium',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message
    });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'email', 'role'],
          include: [{
            model: Donor,
            attributes: ['full_name', 'phone']
          }]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['user_id', 'email']
        }
      ]
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Non-admins can only view their own complaints
    if (req.user.role !== 'admin' && complaint.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message
    });
  }
};

// Admin: Respond to complaint
exports.respondToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_response, status } = req.body;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.admin_response = admin_response;
    complaint.responded_by = req.user.user_id;
    complaint.responded_at = new Date();
    
    if (status) {
      complaint.status = status;
      if (status === 'resolved' || status === 'closed') {
        complaint.resolved_at = new Date();
      }
    } else {
      complaint.status = 'under_review';
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Response submitted successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to respond to complaint',
      error: error.message
    });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;
    if (status === 'resolved' || status === 'closed') {
      complaint.resolved_at = new Date();
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};

// Delete complaint (user can delete own pending complaints)
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && complaint.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Users can only delete pending complaints
    if (req.user.role !== 'admin' && complaint.status !== 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete complaints that are being reviewed'
      });
    }

    await complaint.destroy();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message
    });
  }
};