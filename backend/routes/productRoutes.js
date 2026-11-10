const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilterMeta,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/meta/filters', getFilterMeta);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;

