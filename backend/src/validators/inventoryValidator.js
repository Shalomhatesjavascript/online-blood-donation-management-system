const { body, validationResult } = require('express-validator');

const validateAddBloodUnit = [
  body('blood_group')
    .notEmpty()
    .withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  
  body('donation_date')
    .optional()
    .isDate()
    .withMessage('Invalid donation date'),
  
  body('storage_location')
    .notEmpty()
    .withMessage('Storage location is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Storage location must be between 1-100 characters'),
  
  body('donor_id')
    .optional({ checkFalsy: true }) // This allows empty string, null, undefined
    .isInt({ min: 1 })
    .withMessage('Donor ID must be a positive integer')
];

const validateUpdateBloodUnit = [
  body('status')
    .optional()
    .isIn(['available', 'used', 'expired', 'discarded'])
    .withMessage('Invalid status')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

module.exports = {
  validateAddBloodUnit,
  validateUpdateBloodUnit,
  handleValidationErrors
};