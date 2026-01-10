require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE || '1h',
  
  generateToken: (payload) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, module.exports.secret, {
      expiresIn: module.exports.expiresIn
    });
  },
  
  verifyToken: (token) => {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, module.exports.secret);
  }
};