const mongoose = require('mongoose');

const OrderItemSnapshotSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  brand: { type: String, default: '' },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  items: [OrderItemSnapshotSchema],
  shippingAddress: {
    recipient: { type: String, required: true },
    phone: { type: String, required: true },
    addressLines: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  totals: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'Card', 'UPI', 'Cash on Delivery'],
    default: 'Razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed',
  },
  trackingNumber: { type: String, default: '' },
  statusTimeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comment: { type: String, default: '' },
  }],
  paymentDetails: {
    gateway: { type: String, default: 'Razorpay' },
    gatewayOrderId: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    signature: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

