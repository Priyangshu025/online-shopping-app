const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;

