const jwt = require('jsonwebtoken');
const { getStatus } = require('../config/db');
const { getCollection } = require('../data/store');
const UserMongoose = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_online_shopping');

      let user = null;
      if (getStatus()) {
        user = await UserMongoose.findById(decoded.id).select('-password');
      } else {
        const store = getCollection('users');
        user = await store.findById(decoded.id);
        if (user) {
          const { password, ...safeUser } = user;
          user = safeUser;
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or authorization failed' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no bearer token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_online_shopping');
      let user = null;
      if (getStatus()) {
        user = await UserMongoose.findById(decoded.id).select('-password');
      } else {
        const store = getCollection('users');
        user = await store.findById(decoded.id);
      }
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

module.exports = {
  protect,
  admin,
  optionalAuth
};

