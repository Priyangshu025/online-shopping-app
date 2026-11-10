const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB, getStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const seedAll = require('./utils/seedData');
const { readData } = require('./data/store');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ShopNova E-Commerce REST API',
    database: getStatus() ? 'MongoDB' : 'Local JSON Persistent Store',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  await connectDB();

  // If initial seed is required
  const existingProducts = readData('products');
  if (!existingProducts || existingProducts.length === 0) {
    console.log('[Server Startup] Store is empty. Running initial database seeder...');
    await seedAll();
  }

  app.listen(PORT, () => {
    console.log(`🚀 ShopNova Backend Server running on http://localhost:${PORT}`);
    console.log(`📦 Database Mode: ${getStatus() ? 'MongoDB Connected' : 'Resilient Local Store'}`);
    console.log(`🔑 Demo Admin: admin@shopnova.com | admin123`);
    console.log(`🔑 Demo Customer: customer@shopnova.com | customer123`);
  });
};

startServer();

