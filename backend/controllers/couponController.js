const dbService = require('../services/dbService');

// @desc    Apply and validate coupon code
// @route   POST /api/coupons/apply
// @access  Public or Private
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await dbService.coupons.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
      });
    }

    let discount = (cartTotal * coupon.discountPercent) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You saved ₹${Math.round(discount)}`,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: Math.round(discount),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to apply coupon' });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await dbService.coupons.find({});
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve coupons' });
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, maxDiscount, minOrderValue, expiryDate } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ success: false, message: 'Code and discount percent are required' });
    }

    const newCoupon = await dbService.coupons.create({
      code: code.toUpperCase().trim(),
      discountPercent: Number(discountPercent),
      maxDiscount: Number(maxDiscount) || 1000,
      minOrderValue: Number(minOrderValue) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Coupon created', data: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    await dbService.coupons.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};

module.exports = {
  applyCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
};

