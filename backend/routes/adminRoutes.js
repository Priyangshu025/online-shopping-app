const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllOrders,
  getAllCustomers,
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getAdminDashboard);
router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;

