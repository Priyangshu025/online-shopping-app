const { getStatus } = require('../config/db');
const { getCollection } = require('../data/store');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

const dbService = {
  // USERS
  users: {
    async findById(id) {
      if (getStatus()) return await User.findById(id).select('-password');
      const u = await getCollection('users').findById(id);
      if (u) {
        const { password, ...safe } = u;
        return safe;
      }
      return null;
    },
    async findByIdWithPassword(id) {
      if (getStatus()) return await User.findById(id);
      return await getCollection('users').findById(id);
    },
    async findOne(query) {
      if (getStatus()) return await User.findOne(query);
      return await getCollection('users').findOne(query);
    },
    async create(userData) {
      if (getStatus()) return await User.create(userData);
      return await getCollection('users').create(userData);
    },
    async findByIdAndUpdate(id, update) {
      if (getStatus()) return await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
      const u = await getCollection('users').findByIdAndUpdate(id, update);
      if (u) {
        const { password, ...safe } = u;
        return safe;
      }
      return null;
    },
    async countDocuments(query = {}) {
      if (getStatus()) return await User.countDocuments(query);
      return await getCollection('users').countDocuments(query);
    },
    async find(query = {}) {
      if (getStatus()) return await User.find(query).select('-password');
      const all = await getCollection('users').find(query);
      return all.map(u => {
        const { password, ...safe } = u;
        return safe;
      });
    }
  },

  // PRODUCTS
  products: {
    async find(filter = {}) {
      if (getStatus()) {
        const mongoQuery = {};
        if (filter.category && filter.category !== 'all') mongoQuery.category = filter.category;
        if (filter.brand) mongoQuery.brand = filter.brand;
        if (filter.status) mongoQuery.status = filter.status;
        if (filter.isFeatured !== undefined) mongoQuery.isFeatured = filter.isFeatured;
        if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
          mongoQuery.price = {};
          if (filter.minPrice !== undefined) mongoQuery.price.$gte = Number(filter.minPrice);
          if (filter.maxPrice !== undefined) mongoQuery.price.$lte = Number(filter.maxPrice);
        }
        if (filter.rating) mongoQuery.rating = { $gte: Number(filter.rating) };
        if (filter.search) {
          mongoQuery.$or = [
            { name: { $regex: filter.search, $options: 'i' } },
            { description: { $regex: filter.search, $options: 'i' } },
            { brand: { $regex: filter.search, $options: 'i' } },
          ];
        }
        let q = Product.find(mongoQuery);
        if (filter.sort === 'price_asc') q = q.sort({ price: 1 });
        else if (filter.sort === 'price_desc') q = q.sort({ price: -1 });
        else if (filter.sort === 'rating') q = q.sort({ rating: -1 });
        else q = q.sort({ createdAt: -1 });
        return await q.exec();
      }

      // Local JSON Store
      let items = await getCollection('products').find();
      if (filter.status) {
        items = items.filter(p => p.status === filter.status);
      }
      if (filter.category && filter.category !== 'all') {
        items = items.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
      }
      if (filter.brand) {
        items = items.filter(p => p.brand.toLowerCase() === filter.brand.toLowerCase());
      }
      if (filter.minPrice !== undefined) {
        items = items.filter(p => p.price >= Number(filter.minPrice));
      }
      if (filter.maxPrice !== undefined) {
        items = items.filter(p => p.price <= Number(filter.maxPrice));
      }
      if (filter.rating !== undefined) {
        items = items.filter(p => (p.rating || 0) >= Number(filter.rating));
      }
      if (filter.isFeatured !== undefined) {
        items = items.filter(p => p.isFeatured === filter.isFeatured);
      }
      if (filter.inStock) {
        items = items.filter(p => (p.stock || 0) > 0);
      }
      if (filter.search) {
        const s = filter.search.toLowerCase();
        items = items.filter(p => 
          (p.name && p.name.toLowerCase().includes(s)) ||
          (p.description && p.description.toLowerCase().includes(s)) ||
          (p.brand && p.brand.toLowerCase().includes(s))
        );
      }

      // Sort
      if (filter.sort === 'price_asc') {
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (filter.sort === 'price_desc') {
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (filter.sort === 'rating') {
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }

      return items;
    },

    async findById(id) {
      if (getStatus()) return await Product.findById(id);
      return await getCollection('products').findById(id);
    },

    async create(data) {
      if (getStatus()) return await Product.create(data);
      return await getCollection('products').create(data);
    },

    async findByIdAndUpdate(id, update) {
      if (getStatus()) return await Product.findByIdAndUpdate(id, update, { new: true });
      return await getCollection('products').findByIdAndUpdate(id, update);
    },

    async findByIdAndDelete(id) {
      if (getStatus()) return await Product.findByIdAndDelete(id);
      return await getCollection('products').findByIdAndDelete(id);
    },

    async countDocuments(query = {}) {
      if (getStatus()) return await Product.countDocuments(query);
      return await getCollection('products').countDocuments(query);
    }
  },

  // CATEGORIES
  categories: {
    async find(query = {}) {
      if (getStatus()) return await Category.find(query);
      return await getCollection('categories').find(query);
    },
    async findById(id) {
      if (getStatus()) return await Category.findById(id);
      return await getCollection('categories').findById(id);
    },
    async create(data) {
      if (getStatus()) return await Category.create(data);
      return await getCollection('categories').create(data);
    },
    async findByIdAndUpdate(id, update) {
      if (getStatus()) return await Category.findByIdAndUpdate(id, update, { new: true });
      return await getCollection('categories').findByIdAndUpdate(id, update);
    },
    async findByIdAndDelete(id) {
      if (getStatus()) return await Category.findByIdAndDelete(id);
      return await getCollection('categories').findByIdAndDelete(id);
    }
  },

  // CARTS
  carts: {
    async findOne(query) {
      if (getStatus()) return await Cart.findOne(query);
      return await getCollection('carts').findOne(query);
    },
    async create(data) {
      if (getStatus()) return await Cart.create(data);
      return await getCollection('carts').create(data);
    },
    async findOneAndUpdate(query, update, options = { new: true, upsert: true }) {
      if (getStatus()) return await Cart.findOneAndUpdate(query, update, options);
      const store = getCollection('carts');
      let cart = await store.findOne(query);
      if (cart) {
        return await store.findByIdAndUpdate(cart._id, update);
      } else {
        return await store.create({ ...query, ...update });
      }
    }
  },

  // ORDERS
  orders: {
    async find(query = {}, sort = { createdAt: -1 }) {
      if (getStatus()) return await Order.find(query).sort(sort);
      let items = await getCollection('orders').find(query);
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    },
    async findById(id) {
      if (getStatus()) return await Order.findById(id);
      return await getCollection('orders').findById(id);
    },
    async create(data) {
      if (getStatus()) return await Order.create(data);
      return await getCollection('orders').create(data);
    },
    async findByIdAndUpdate(id, update) {
      if (getStatus()) return await Order.findByIdAndUpdate(id, update, { new: true });
      return await getCollection('orders').findByIdAndUpdate(id, update);
    },
    async countDocuments(query = {}) {
      if (getStatus()) return await Order.countDocuments(query);
      return await getCollection('orders').countDocuments(query);
    }
  },

  // REVIEWS
  reviews: {
    async find(query = {}) {
      if (getStatus()) return await Review.find(query).sort({ createdAt: -1 });
      let items = await getCollection('reviews').find(query);
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    },
    async create(data) {
      if (getStatus()) return await Review.create(data);
      return await getCollection('reviews').create(data);
    },
    async findByIdAndDelete(id) {
      if (getStatus()) return await Review.findByIdAndDelete(id);
      return await getCollection('reviews').findByIdAndDelete(id);
    }
  },

  // COUPONS
  coupons: {
    async find(query = {}) {
      if (getStatus()) return await Coupon.find(query);
      return await getCollection('coupons').find(query);
    },
    async findOne(query) {
      if (getStatus()) return await Coupon.findOne(query);
      return await getCollection('coupons').findOne(query);
    },
    async create(data) {
      if (getStatus()) return await Coupon.create(data);
      return await getCollection('coupons').create(data);
    },
    async findByIdAndUpdate(id, update) {
      if (getStatus()) return await Coupon.findByIdAndUpdate(id, update, { new: true });
      return await getCollection('coupons').findByIdAndUpdate(id, update);
    },
    async findByIdAndDelete(id) {
      if (getStatus()) return await Coupon.findByIdAndDelete(id);
      return await getCollection('coupons').findByIdAndDelete(id);
    }
  }
};

module.exports = dbService;

