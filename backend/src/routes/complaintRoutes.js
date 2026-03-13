const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateCreateComplaint, validateRespondToComplaint, handleValidationErrors } = require('../validators/complaintValidator');

// All routes require authentication
router.use(authMiddleware);

// Get complaints (users see own, admins see all)
router.get('/',
  checkRole('donor', 'recipient', 'admin'),
  complaintController.getComplaints
);

// Create complaint (donors and recipients only)
router.post('/',
  checkRole('donor', 'recipient'),
  validateCreateComplaint,
  handleValidationErrors,
  complaintController.createComplaint
);

// Get specific complaint
router.get('/:id',
  checkRole('donor', 'recipient', 'admin'),
  complaintController.getComplaintById
);

// Admin: Respond to complaint
router.put('/:id/respond',
  checkRole('admin'),
  validateRespondToComplaint,
  handleValidationErrors,
  complaintController.respondToComplaint
);

// Admin: Update status
router.put('/:id/status',
  checkRole('admin'),
  complaintController.updateComplaintStatus
);

// Delete complaint
router.delete('/:id',
  checkRole('donor', 'recipient', 'admin'),
  complaintController.deleteComplaint
);

module.exports = router;