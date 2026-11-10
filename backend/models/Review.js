const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  productId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  verifiedPurchase: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

