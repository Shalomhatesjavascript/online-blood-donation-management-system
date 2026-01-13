const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateDonorSearch, validateDonorUpdate, handleValidationErrors } = require('../validators/donorValidator');

// All routes require authentication
router.use(authMiddleware);

// Search donors (recipient, admin) - FIXED: Changed from donors/ to search/
router.get('/search', 
  checkRole('recipient', 'admin'),
  validateDonorSearch,
  handleValidationErrors,
  donorController.searchDonors
);

// Get ALL donors (admin only) - NEW ROUTE
router.get('/all',
  checkRole('admin'),
  donorController.getAllDonors
);

// Get eligible donors (admin only)
router.get('/eligible',
  checkRole('admin'),
  donorController.getEligibleDonors
);

// Get specific donor
router.get('/:id',
  checkRole('donor', 'admin'),
  donorController.getDonorById
);

// Update donor profile (donor updates own, admin updates any)
router.put('/:id',
  checkRole('donor', 'admin'),
  validateDonorUpdate,
  handleValidationErrors,
  donorController.updateDonor
);

// Update donation date (admin only) - NEW ROUTE
router.put('/:id/donation-date',
  checkRole('admin'),
  donorController.updateDonationDate
);

// Get donation history
router.get('/:id/history',
  checkRole('donor', 'admin'),
  donorController.getDonationHistory
);

module.exports = router;