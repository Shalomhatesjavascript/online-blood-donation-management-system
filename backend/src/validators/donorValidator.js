const { body, query, param, validationResult } = require('express-validator');

const validateDonorSearch = [
  query('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  
  query('eligible_only')
    .optional()
    .isBoolean()
    .withMessage('eligible_only must be true or false')
];

const validateDonorUpdate = [
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2-255 characters'),
  
  body('age')
    .optional()
    .isInt({ min: 18, max: 65 })
    .withMessage('Age must be between 18-65'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-() ]+$/)
    .withMessage('Invalid phone number'),
  
  body('last_donation_date')
    .optional()
    .isDate()
    .withMessage('Invalid date format')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateDonorSearch,
  validateDonorUpdate,
  handleValidationErrors
};