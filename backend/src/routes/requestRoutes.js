const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateCreateRequest, handleValidationErrors } = require('../validators/requestValidator');

// All routes require authentication
router.use(authMiddleware);

// Get requests (recipients see own, admins see all)
router.get('/',
  checkRole('recipient', 'admin'),
  requestController.getRequests
);

// Create request (recipient only)
router.post('/',
  checkRole('recipient'),
  validateCreateRequest,
  handleValidationErrors,
  requestController.createRequest
);

// Approve request (admin only)
router.put('/:id/approve',
  checkRole('admin'),
  requestController.approveRequest
);

// Reject request (admin only)
router.put('/:id/reject',
  checkRole('admin'),
  requestController.rejectRequest
);

// Cancel request (recipient only)
router.delete('/:id',
  checkRole('recipient'),
  requestController.cancelRequest
);

module.exports = router;