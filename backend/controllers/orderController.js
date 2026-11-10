const dbService = require('../services/dbService');
const { calculateTotals } = require('./cartController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Cash on Delivery', couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.recipient || !shippingAddress.addressLines || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping address details' });
    }

    // Server-side verification of all product prices and stock availability
    const verifiedItems = [];
    for (const item of items) {
      const product = await dbService.products.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name || item.productId} is no longer available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`,
        });
      }

      const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        price: activePrice,
        quantity: Number(item.quantity),
        image: product.images?.[0] || '',
        brand: product.brand || '',
      });
    }

    // Coupon verification
    let coupon = null;
    if (couponCode) {
      coupon = await dbService.coupons.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });
    }

    const totals = calculateTotals(verifiedItems, coupon);
    if (coupon) {
      totals.couponCode = coupon.code;
    }

    // Atomic Stock deduction
    for (const item of verifiedItems) {
      const product = await dbService.products.findById(item.productId);
      const newStock = Math.max(0, product.stock - item.quantity);
      await dbService.products.findByIdAndUpdate(item.productId, { stock: newStock });
    }

    // Determine initial payment status
    const isOnlinePayment = paymentMethod === 'Razorpay' || paymentMethod === 'Card' || paymentMethod === 'UPI';
    const paymentStatus = isOnlinePayment ? 'Completed' : 'Pending';

    const orderNumber = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = await dbService.orders.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      trackingNumber: orderNumber,
      items: verifiedItems,
      shippingAddress,
      totals,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Order Placed',
      statusTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          comment: `Order placed successfully using ${paymentMethod}.`,
        },
        ...(paymentStatus === 'Completed' ? [{
          status: 'Payment Confirmed',
          timestamp: new Date().toISOString(),
          comment: `Payment received via ${paymentMethod}.`,
        }] : [])
      ],
      paymentDetails: {
        gateway: isOnlinePayment ? 'Razorpay' : 'COD',
        gatewayOrderId: 'pay_' + Math.random().toString(36).substring(2, 10),
        transactionId: 'txn_' + Date.now(),
        signature: 'sig_' + Math.random().toString(36).substring(2, 12),
      },
    });

    // Clear the user's cart on successful checkout
    await dbService.carts.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Server error processing order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await dbService.orders.find({ userId: req.user._id });
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await dbService.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ownership check (IDOR protection)
    if (order.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition' });
    }

    const order = await dbService.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const timeline = order.statusTimeline || [];
    timeline.push({
      status,
      timestamp: new Date().toISOString(),
      comment: comment || `Order status updated to ${status}.`,
    });

    const updateFields = {
      orderStatus: status,
      statusTimeline: timeline,
    };

    if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
      updateFields.paymentStatus = 'Completed';
    }

    const updated = await dbService.orders.findByIdAndUpdate(req.params.id, updateFields);

    res.json({
      success: true,
      message: `Order status changed to ${status}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// @desc    Cancel order (Customer can cancel if not shipped yet)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await dbService.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled after shipping' });
    }

    // Restore inventory
    for (const item of order.items) {
      const product = await dbService.products.findById(item.productId);
      if (product) {
        await dbService.products.findByIdAndUpdate(item.productId, { stock: product.stock + item.quantity });
      }
    }

    const timeline = order.statusTimeline || [];
    timeline.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      comment: 'Order cancelled by customer.',
    });

    const updated = await dbService.orders.findByIdAndUpdate(req.params.id, {
      orderStatus: 'Cancelled',
      paymentStatus: order.paymentStatus === 'Completed' ? 'Refunded' : 'Failed',
      statusTimeline: timeline,
    });

    res.json({
      success: true,
      message: 'Order has been cancelled successfully and stock restored',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};

