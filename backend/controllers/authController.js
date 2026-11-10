const bcrypt = require('bcryptjs');
const dbService = require('../services/dbService');
const generateToken = require('../utils/generateToken');

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await dbService.users.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbService.users.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
      addresses: [],
      wishlist: [],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await dbService.users.findByIdWithPassword ? 
      await dbService.users.findOne({ email: normalizedEmail }) : 
      await dbService.users.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'customer',
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await dbService.users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
};

// @desc    Update user profile & address
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, addresses, password } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (phone !== undefined) update.phone = phone;
    if (addresses) update.addresses = addresses;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await dbService.users.findByIdAndUpdate(req.user._id, update);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/toggle
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const user = await dbService.users.findById(req.user._id);
    let wishlist = user.wishlist || [];

    const index = wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
      added = true;
    }

    await dbService.users.findByIdAndUpdate(req.user._id, { wishlist });

    res.json({
      success: true,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      data: { wishlist, isWishlisted: added },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
};

