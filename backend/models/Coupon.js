const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  maxDiscount: { type: Number, default: 1000 },
  minOrderValue: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

