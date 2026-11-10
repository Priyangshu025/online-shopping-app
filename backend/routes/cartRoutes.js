const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);
router.post('/sync', syncCart);

module.exports = router;

