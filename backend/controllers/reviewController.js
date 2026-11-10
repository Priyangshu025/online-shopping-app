const dbService = require('../services/dbService');

// @desc    Submit a review for a product
// @route   POST /api/reviews
// @access  Private
const submitReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide productId, rating, and comment' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }

    const product = await dbService.products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify if customer actually purchased this product (Verified Purchase badge)
    const userOrders = await dbService.orders.find({
      userId: req.user._id,
      orderStatus: { $in: ['Delivered', 'Processing', 'Shipped', 'Out for Delivery'] },
    });

    const isVerifiedPurchase = userOrders.some(order =>
      (order.items || []).some(item => item.productId === productId)
    );

    const review = await dbService.reviews.create({
      userId: req.user._id,
      userName: req.user.name,
      productId,
      rating: numRating,
      comment: comment.trim(),
      verifiedPurchase: isVerifiedPurchase,
    });

    // Recalculate product overall rating and numReviews
    const allReviews = await dbService.reviews.find({ productId });
    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalScore / allReviews.length).toFixed(1);

    await dbService.products.findByIdAndUpdate(productId, {
      rating: Number(avgRating),
      numReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await dbService.reviews.find({ productId });
    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
  }
};

// @desc    Delete/Moderate a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await dbService.reviews.find({ _id: id });
    const targetReview = review[0];

    if (!targetReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && targetReview.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await dbService.reviews.findByIdAndDelete(id);

    // Recalculate product rating
    const remainingReviews = await dbService.reviews.find({ productId: targetReview.productId });
    const totalScore = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = remainingReviews.length > 0 ? (totalScore / remainingReviews.length).toFixed(1) : 0;

    await dbService.products.findByIdAndUpdate(targetReview.productId, {
      rating: Number(avgRating),
      numReviews: remainingReviews.length,
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

module.exports = {
  submitReview,
  getProductReviews,
  deleteReview,
};

