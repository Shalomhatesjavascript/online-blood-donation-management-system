const { body, validationResult } = require('express-validator');

const validateCreateComplaint = [
  body('subject')
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 255 }).withMessage('Subject must be between 5-255 characters'),
  
  body('category')
    .isIn(['blood_quality', 'service_delay', 'staff_conduct', 'system_issue', 'donor_availability', 'request_processing', 'other'])
    .withMessage('Invalid category'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority')
];

const validateRespondToComplaint = [
  body('admin_response')
    .notEmpty().withMessage('Response is required')
    .isLength({ min: 10 }).withMessage('Response must be at least 10 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'under_review', 'resolved', 'closed'])
    .withMessage('Invalid status')
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
  validateCreateComplaint,
  validateRespondToComplaint,
  handleValidationErrors
};