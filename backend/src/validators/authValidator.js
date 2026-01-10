const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  body('role')
    .isIn(['donor', 'recipient', 'admin']).withMessage('Invalid role'),
  
  body('full_name')
    .if(body('role').equals('donor'))
    .notEmpty().withMessage('Full name is required for donors')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2-255 characters'),
  
  body('age')
    .if(body('role').equals('donor'))
    .isInt({ min: 18, max: 65 }).withMessage('Age must be between 18-65'),
  
  body('gender')
    .if(body('role').equals('donor'))
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  
  body('blood_group')
    .if(body('role').equals('donor'))
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  
  body('phone')
    .if(body('role').equals('donor'))
    .matches(/^[0-9+\-() ]+$/).withMessage('Invalid phone number'),
  
  body('address')
    .if(body('role').equals('donor'))
    .notEmpty().withMessage('Address is required for donors'),
  
  body('city')
    .if(body('role').equals('donor'))
    .notEmpty().withMessage('City is required for donors'),
  
  body('state')
    .if(body('role').equals('donor'))
    .notEmpty().withMessage('State is required for donors')
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
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
  validateRegistration,
  validateLogin,
  handleValidationErrors
};