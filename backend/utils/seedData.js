const bcrypt = require('bcryptjs');
const { getCollection } = require('../data/store');
const { connectDB, getStatus } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

const seedAll = async () => {
  console.log('Seeding demo e-commerce data...');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const customerPassword = await bcrypt.hash('customer123', salt);

  const usersData = [
    {
      _id: 'usr_admin_001',
      name: 'System Admin',
      email: 'admin@shopnova.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'admin',
      addresses: [
        {
          recipient: 'Admin HQ',
          phone: '+91 98765 43210',
          addressLines: 'Tech Park, Block B, 4th Floor',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          isDefault: true,
        },
      ],
      wishlist: [],
    },
    {
      _id: 'usr_cust_001',
      name: 'Priya Sharma',
      email: 'customer@shopnova.com',
      password: customerPassword,
      phone: '+91 91234 56789',
      role: 'customer',
      addresses: [
        {
          recipient: 'Priya Sharma',
          phone: '+91 91234 56789',
          addressLines: 'Flat 402, Sunshine Apartments, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          isDefault: true,
        },
      ],
      wishlist: ['prod_001', 'prod_004'],
    },
  ];

  const categoriesData = [
    {
      _id: 'cat_001',
      categoryName: 'Audio',
      slug: 'audio',
      description: 'Headphones, earbuds, and premium sound systems',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    },
    {
      _id: 'cat_002',
      categoryName: 'Electronics',
      slug: 'electronics',
      description: 'Smart gadgets, cameras, and modern accessories',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=80',
    },
    {
      _id: 'cat_003',
      categoryName: 'Computers & Accessories',
      slug: 'computers-accessories',
      description: 'Keyboards, wireless mice, and productivity monitors',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
    },
    {
      _id: 'cat_004',
      categoryName: 'Wearables',
      slug: 'wearables',
      description: 'Smart watches, fitness trackers, and smart bands',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    },
    {
      _id: 'cat_005',
      categoryName: 'Fashion & Lifestyle',
      slug: 'fashion-lifestyle',
      description: 'Apparel, backpacks, and casual essentials',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    },
  ];

  const productsData = [
    {
      _id: 'prod_001',
      name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
      description: 'Industry-leading noise canceling with two processors and eight microphones. Exceptional sound quality with newly developed 30mm driver unit and crystal clear hands-free calling.',
      price: 29990,
      discountPrice: 26990,
      category: 'Audio',
      brand: 'Sony',
      stock: 18,
      status: 'active',
      isFeatured: true,
      rating: 4.8,
      numReviews: 42,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Battery Life': '30 Hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g', 'Warranty': '1 Year' },
    },
    {
      _id: 'prod_002',
      name: 'Apple Watch Series 9 GPS 45mm',
      description: 'Smarter, brighter, and mightier. Powered by the S9 SiP, featuring Double Tap gesture, always-on Retina display, and advanced health sensors including blood oxygen and ECG.',
      price: 44900,
      discountPrice: 41900,
      category: 'Wearables',
      brand: 'Apple',
      stock: 12,
      status: 'active',
      isFeatured: true,
      rating: 4.9,
      numReviews: 28,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Case Size': '45mm', 'Water Resistance': '50 meters', 'Battery': 'Up to 18 hrs' },
    },
    {
      _id: 'prod_003',
      name: 'Logitech MX Master 3S Wireless Performance Mouse',
      description: 'Ergonomic wireless mouse with Quiet Clicks, 8K DPI track-on-glass sensor, and hyper-fast MagSpeed scrolling wheel for speed and precision.',
      price: 9995,
      discountPrice: 8495,
      category: 'Computers & Accessories',
      brand: 'Logitech',
      stock: 24,
      status: 'active',
      isFeatured: true,
      rating: 4.7,
      numReviews: 35,
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'DPI': '8000', 'Sensor': 'Darkfield high precision', 'Battery': 'Rechargeable 500mAh' },
    },
    {
      _id: 'prod_004',
      name: 'Keychron K2 Wireless Mechanical Keyboard (Version 2)',
      description: '75% layout compact Bluetooth wireless mechanical keyboard with Gateron G Pro Brown switches, RGB backlight, and Mac & Windows compatibility.',
      price: 8499,
      discountPrice: 7299,
      category: 'Computers & Accessories',
      brand: 'Keychron',
      stock: 8,
      status: 'active',
      isFeatured: true,
      rating: 4.6,
      numReviews: 19,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Switches': 'Gateron Brown', 'Layout': '75%', 'Battery': '4000 mAh' },
    },
    {
      _id: 'prod_005',
      name: 'Bose QuietComfort 45 Bluetooth Wireless Headphones',
      description: 'Iconic quiet, comfort, and sound. World-class acoustic noise cancellation with high-fidelity audio and TriPort acoustic architecture.',
      price: 24900,
      discountPrice: 19990,
      category: 'Audio',
      brand: 'Bose',
      stock: 4, // low stock trigger
      status: 'active',
      isFeatured: false,
      rating: 4.5,
      numReviews: 14,
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Playtime': '24 Hours', 'Charging': 'USB-C', 'Modes': 'Quiet & Aware' },
    },
    {
      _id: 'prod_006',
      name: 'Dell UltraSharp 27 4K USB-C Hub Monitor (U2723QE)',
      description: 'Brilliant visuals with IPS Black technology offering a 2,000:1 contrast ratio, 4K resolution, 98% DCI-P3 color gamut, and 90W power delivery over USB-C.',
      price: 52999,
      discountPrice: 47499,
      category: 'Computers & Accessories',
      brand: 'Dell',
      stock: 6,
      status: 'active',
      isFeatured: false,
      rating: 4.8,
      numReviews: 22,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Screen Size': '27 inch', 'Resolution': '3840 x 2160 4K', 'Panel': 'IPS Black' },
    },
    {
      _id: 'prod_007',
      name: 'Fujifilm X-T30 II Mirrorless Digital Camera with 18-55mm Lens',
      description: 'Compact, lightweight body equipped with 26.1MP X-Trans CMOS 4 sensor and high-speed X-Processor 4. Incredible 4K/30p video and iconic Film Simulation modes.',
      price: 89999,
      discountPrice: 84999,
      category: 'Electronics',
      brand: 'Fujifilm',
      stock: 3, // low stock trigger
      status: 'active',
      isFeatured: true,
      rating: 4.9,
      numReviews: 17,
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Megapixels': '26.1 MP', 'Video': '4K 30p', 'Lens': 'XF 18-55mm' },
    },
    {
      _id: 'prod_008',
      name: 'Peak Design Everyday Backpack 20L (Charcoal)',
      description: 'An iconic, multi-award-winning bag for everyday gear and photo equipment. Weatherproof 100% recycled 400D nylon canvas shell with FlexFold dividers.',
      price: 24999,
      discountPrice: 22499,
      category: 'Fashion & Lifestyle',
      brand: 'Peak Design',
      stock: 15,
      status: 'active',
      isFeatured: false,
      rating: 4.8,
      numReviews: 31,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      ],
      specs: { 'Capacity': '20 Liters', 'Laptop Sleeve': 'Up to 15 inch', 'Material': '400D Weatherproof Nylon' },
    },
  ];

  const couponsData = [
    {
      _id: 'cpn_001',
      code: 'WELCOME10',
      discountPercent: 10,
      maxDiscount: 1000,
      minOrderValue: 1500,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
    {
      _id: 'cpn_002',
      code: 'FESTIVE20',
      discountPercent: 20,
      maxDiscount: 2500,
      minOrderValue: 5000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
    {
      _id: 'cpn_003',
      code: 'SUPER500',
      discountPercent: 15,
      maxDiscount: 500,
      minOrderValue: 2000,
      expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
  ];

  const sampleReviews = [
    {
      _id: 'rev_001',
      userId: 'usr_cust_001',
      userName: 'Priya Sharma',
      productId: 'prod_001',
      rating: 5,
      comment: 'Superb sound quality! Noise cancellation is easily the best in class. Battery lasts multiple days of work and calls.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'rev_002',
      userId: 'usr_cust_001',
      userName: 'Priya Sharma',
      productId: 'prod_003',
      rating: 5,
      comment: 'The magnetic scroll wheel and ergonomic thumb rest make long coding sessions effortless.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const sampleOrders = [
    {
      _id: 'ord_demo_001',
      userId: 'usr_cust_001',
      userName: 'Priya Sharma',
      userEmail: 'customer@shopnova.com',
      trackingNumber: 'ORD-849201-3912',
      items: [
        {
          productId: 'prod_001',
          name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
          price: 26990,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          brand: 'Sony',
        },
      ],
      shippingAddress: {
        recipient: 'Priya Sharma',
        phone: '+91 91234 56789',
        addressLines: 'Flat 402, Sunshine Apartments, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
      },
      totals: {
        subtotal: 26990,
        discount: 1000,
        couponCode: 'WELCOME10',
        deliveryCharge: 0,
        tax: 2599,
        finalTotal: 28589,
      },
      paymentMethod: 'Razorpay',
      paymentStatus: 'Completed',
      orderStatus: 'Delivered',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      statusTimeline: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Order placed via Razorpay' },
        { status: 'Processing', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Items packaged and ready' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Dispatched via BlueDart Express' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Courier agent on the way' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Delivered to recipient with signature confirmation' },
      ],
      paymentDetails: {
        gateway: 'Razorpay',
        gatewayOrderId: 'order_test_9831',
        transactionId: 'txn_9831412',
        signature: 'sig_verified_mock',
      },
    },
    {
      _id: 'ord_demo_002',
      userId: 'usr_cust_001',
      userName: 'Priya Sharma',
      userEmail: 'customer@shopnova.com',
      trackingNumber: 'ORD-519283-7721',
      items: [
        {
          productId: 'prod_003',
          name: 'Logitech MX Master 3S Wireless Performance Mouse',
          price: 8495,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
          brand: 'Logitech',
        },
      ],
      shippingAddress: {
        recipient: 'Priya Sharma',
        phone: '+91 91234 56789',
        addressLines: 'Flat 402, Sunshine Apartments, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
      },
      totals: {
        subtotal: 8495,
        discount: 0,
        couponCode: '',
        deliveryCharge: 0,
        tax: 850,
        finalTotal: 9345,
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Completed',
      orderStatus: 'Shipped',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      statusTimeline: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Order placed via UPI' },
        { status: 'Processing', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), comment: 'Order verified and packed' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), comment: 'In transit to local hub' },
      ],
      paymentDetails: {
        gateway: 'Razorpay',
        gatewayOrderId: 'order_test_9832',
        transactionId: 'txn_9832811',
        signature: 'sig_verified_mock',
      },
    },
  ];

  // Store in file database
  const usersStore = getCollection('users');
  const productsStore = getCollection('products');
  const categoriesStore = getCollection('categories');
  const couponsStore = getCollection('coupons');
  const reviewsStore = getCollection('reviews');
  const ordersStore = getCollection('orders');

  const { writeData } = require('../data/store');
  writeData('users', usersData);
  writeData('products', productsData);
  writeData('categories', categoriesData);
  writeData('coupons', couponsData);
  writeData('reviews', sampleReviews);
  writeData('orders', sampleOrders);
  writeData('carts', []);

  // Also seed MongoDB if live
  if (getStatus()) {
    try {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Coupon.deleteMany({});
      await Review.deleteMany({});
      await Order.deleteMany({});

      await User.insertMany(usersData);
      await Product.insertMany(productsData);
      await Category.insertMany(categoriesData);
      await Coupon.insertMany(couponsData);
      await Review.insertMany(sampleReviews);
      await Order.insertMany(sampleOrders);
      console.log('[MongoDB] Seeded successfully into Mongo collections.');
    } catch (err) {
      console.log('[MongoDB] Mongoose seed notice:', err.message);
    }
  }

  console.log('✅ Demo data seeding completed successfully!');
  console.log('👤 Admin: admin@shopnova.com / admin123');
  console.log('👤 Customer: customer@shopnova.com / customer123');
};

if (require.main === module) {
  connectDB().then(() => {
    seedAll().then(() => process.exit(0));
  });
}

module.exports = seedAll;

