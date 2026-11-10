const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);

