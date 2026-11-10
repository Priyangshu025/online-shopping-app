const dbService = require('../services/dbService');

// @desc    Fetch all products with filtering, search, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, rating, inStock, search, sort, isFeatured } = req.query;

    const filter = {
      status: 'active',
    };

    if (category && category !== 'All') filter.category = category;
    if (brand && brand !== 'All') filter.brand = brand;
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (rating) filter.rating = Number(rating);
    if (inStock === 'true') filter.inStock = true;
    if (search) filter.search = search;
    if (sort) filter.sort = sort;
    if (isFeatured === 'true') filter.isFeatured = true;

    const products = await dbService.products.find(filter);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await dbService.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch reviews for this product
    const reviews = await dbService.reviews.find({ productId: req.params.id });

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving product details' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      status,
      isFeatured,
      specs,
    } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, category, and brand' });
    }

    const newProduct = await dbService.products.create({
      name: name.trim(),
      description: description || '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category: category.trim(),
      brand: brand.trim(),
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      stock: Number(stock) || 0,
      status: status || 'active',
      isFeatured: Boolean(isFeatured),
      specs: specs || {},
      rating: 0,
      numReviews: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await dbService.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = await dbService.products.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc    Delete/Archive a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await dbService.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await dbService.products.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

// @desc    Get all categories and brands for filters
// @route   GET /api/products/meta/filters
// @access  Public
const getFilterMeta = async (req, res) => {
  try {
    const allProducts = await dbService.products.find({});
    const categoriesSet = new Set();
    const brandsSet = new Set();

    allProducts.forEach(p => {
      if (p.category) categoriesSet.add(p.category);
      if (p.brand) brandsSet.add(p.brand);
    });

    res.json({
      success: true,
      data: {
        categories: Array.from(categoriesSet),
        brands: Array.from(brandsSet),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get filter metadata' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilterMeta,
};

