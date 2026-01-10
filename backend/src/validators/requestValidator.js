const { body, validationResult } = require('express-validator');

const validateCreateRequest = [
  body('blood_group')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  
  body('units_needed')
    .isInt({ min: 1, max: 10 })
    .withMessage('Units needed must be between 1-10'),
  
  body('urgency_level')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid urgency level'),
  
  body('hospital_location')
    .notEmpty()
    .withMessage('Hospital location is required')
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
  validateCreateRequest,
  handleValidationErrors
};