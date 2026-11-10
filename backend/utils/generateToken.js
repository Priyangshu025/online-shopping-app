const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role || 'customer' },
    process.env.JWT_SECRET || 'fallback_secret_key_online_shopping',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;

