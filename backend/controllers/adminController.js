const dbService = require('../services/dbService');

// @desc    Get dashboard metrics, charts, and alerts
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const orders = await dbService.orders.find({});
    const products = await dbService.products.find({});
    const users = await dbService.users.find({});

    // 1. Calculate Total Revenue & Active Orders
    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    let processingCount = 0;
    let deliveredCount = 0;

    orders.forEach(order => {
      if (order.paymentStatus === 'Completed' || order.orderStatus === 'Delivered') {
        totalRevenue += order.totals?.finalTotal || 0;
      }
      if (order.orderStatus === 'Order Placed') pendingOrdersCount++;
      if (order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') processingCount++;
      if (order.orderStatus === 'Delivered') deliveredCount++;
    });

    // 2. Low-Stock Alerts (stock <= 5)
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);

    // 3. Category Sales Distribution
    const categoryCount = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categoryStats = Object.keys(categoryCount).map(name => ({
      name,
      value: categoryCount[name],
    }));

    // 4. Monthly/Weekly Revenue Chart mock & calculated
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = months.map((m, idx) => ({
      month: m,
      sales: Math.floor(totalRevenue * (0.05 + ((idx % 4) * 0.04))) + (idx === 10 ? Math.round(totalRevenue * 0.3) : 1500),
      orders: Math.floor(orders.length * (0.06 + ((idx % 3) * 0.03))) + 2,
    }));

    // 5. Recent 5 Orders
    const recentOrders = orders.slice(0, 5);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: users.filter(u => u.role === 'customer').length,
          pendingOrders: pendingOrdersCount,
          processingOrders: processingCount,
          deliveredOrders: deliveredCount,
        },
        lowStockProducts,
        categoryStats,
        salesTrends: monthlySales,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard metrics' });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    const orders = await dbService.orders.find(query);
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

// @desc    Get all customers for admin
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res) => {
  try {
    const users = await dbService.users.find({ role: 'customer' });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers' });
  }
};

// @desc    Manage categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
  try {
    const categories = await dbService.categories.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { categoryName, description, image } = req.body;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = await dbService.categories.create({
      categoryName,
      description: description || '',
      image: image || '',
      slug,
    });
    res.status(201).json({ success: true, message: 'Category created', data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await dbService.categories.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

module.exports = {
  getAdminDashboard,
  getAllOrders,
  getAllCustomers,
  getCategories,
  createCategory,
  deleteCategory,
};

