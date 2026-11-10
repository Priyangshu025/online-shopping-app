const dbService = require('../services/dbService');

// Helper to calculate cart totals
const calculateTotals = (items, coupon = null) => {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon && coupon.isActive) {
    if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
      discount = (subtotal * coupon.discountPercent) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }

  // Delivery: Free over 1000, else 100
  const deliveryCharge = subtotal > 1000 || items.length === 0 ? 0 : 99;
  // Tax: 10% standard e-commerce tax
  const tax = Math.round((subtotal - discount) * 0.10);
  const finalTotal = Math.max(0, subtotal - discount + deliveryCharge + tax);

  return {
    subtotal,
    discount,
    deliveryCharge,
    tax,
    finalTotal,
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await dbService.carts.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await dbService.carts.create({ userId: req.user._id, items: [] });
    }

    const totals = calculateTotals(cart.items || []);

    res.json({
      success: true,
      data: {
        items: cart.items || [],
        totals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await dbService.products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`,
      });
    }

    let cart = await dbService.carts.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await dbService.carts.create({ userId: req.user._id, items: [] });
    }

    const items = [...(cart.items || [])];
    const existingIndex = items.findIndex(item => item.productId === productId);

    const price = product.price;
    const discountPrice = product.discountPrice || 0;
    const image = product.images && product.images.length > 0 ? product.images[0] : '';

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} items)`,
        });
      }
      items[existingIndex].quantity = newQty;
      items[existingIndex].price = price;
      items[existingIndex].discountPrice = discountPrice;
      items[existingIndex].image = image;
    } else {
      items.push({
        productId,
        name: product.name,
        price,
        discountPrice,
        image,
        quantity: Number(quantity),
      });
    }

    const updatedCart = await dbService.carts.findOneAndUpdate(
      { userId: req.user._id },
      { items }
    );

    const totals = calculateTotals(updatedCart.items);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: updatedCart.items,
        totals,
      },
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PATCH /api/cart/items/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    const product = await dbService.products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`,
      });
    }

    let cart = await dbService.carts.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const items = (cart.items || []).map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });

    const updatedCart = await dbService.carts.findOneAndUpdate(
      { userId: req.user._id },
      { items }
    );

    const totals = calculateTotals(updatedCart.items);

    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        items: updatedCart.items,
        totals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update item quantity' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await dbService.carts.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const items = (cart.items || []).filter(item => item.productId !== productId);
    const updatedCart = await dbService.carts.findOneAndUpdate(
      { userId: req.user._id },
      { items }
    );

    const totals = calculateTotals(updatedCart.items);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: updatedCart.items,
        totals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await dbService.carts.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );
    res.json({
      success: true,
      message: 'Cart cleared',
      data: { items: [], totals: calculateTotals([]) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

// @desc    Sync guest cart to logged-in user cart
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items: guestItems = [] } = req.body;
    let cart = await dbService.carts.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await dbService.carts.create({ userId: req.user._id, items: [] });
    }

    let items = [...(cart.items || [])];

    for (const gItem of guestItems) {
      const product = await dbService.products.findById(gItem.productId);
      if (!product || product.stock <= 0) continue;

      const idx = items.findIndex(i => i.productId === gItem.productId);
      if (idx > -1) {
        items[idx].quantity = Math.min(product.stock, items[idx].quantity + gItem.quantity);
      } else {
        items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          image: product.images?.[0] || '',
          quantity: Math.min(product.stock, gItem.quantity),
        });
      }
    }

    const updated = await dbService.carts.findOneAndUpdate({ userId: req.user._id }, { items });
    res.json({
      success: true,
      data: {
        items: updated.items,
        totals: calculateTotals(updated.items),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to synchronize cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  syncCart,
  calculateTotals,
};

