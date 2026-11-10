const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  image: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: true });

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

