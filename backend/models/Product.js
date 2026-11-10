const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  category: { type: String, required: true, index: true },
  categoryId: { type: String, default: '' },
  brand: { type: String, required: true, index: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'archived', 'draft'], default: 'active', index: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  specs: { type: Map, of: String, default: {} },
}, {
  timestamps: true,
});

ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);

