const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateAddBloodUnit, validateUpdateBloodUnit, handleValidationErrors } = require('../validators/inventoryValidator');

// All routes require authentication
router.use(authMiddleware);

// Get inventory (all authenticated users can view)
router.get('/', inventoryController.getInventory);

// Get stock statistics
router.get('/stats', inventoryController.getStockStats);

// Get expiring units (admin only)
router.get('/expiring',
  checkRole('admin'),
  inventoryController.getExpiringUnits
);

// Add blood unit (admin only)
router.post('/',
  checkRole('admin'),
  validateAddBloodUnit,
  handleValidationErrors,
  inventoryController.addBloodUnit
);

// Update blood unit (admin only)
router.put('/:id',
  checkRole('admin'),
  validateUpdateBloodUnit,handleValidationErrors,
inventoryController.updateBloodUnit
);
// Delete blood unit (admin only)
router.delete('/:id',
checkRole('admin'),
inventoryController.deleteBloodUnit
);
module.exports = router;