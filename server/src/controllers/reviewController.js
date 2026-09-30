const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Add review for a product from a completed order
// @route   POST /api/reviews
// @access  Private (Buyer)
const createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only review items from your own orders' });
    }

    if (order.orderStatus !== 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Reviews are only allowed after the order is delivered' });
    }

    const itemExistsInOrder = order.items.some(
      (item) => item.product.toString() === productId
    );
    if (!itemExistsInOrder) {
      return res.status(400).json({ success: false, message: 'Product is not part of this order' });
    }

    const existingReview = await Review.findOne({
      buyer: req.user._id,
      product: productId,
      order: orderId,
    });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product for this order' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      buyer: req.user._id,
      farmer: product.farmer,
      product: productId,
      order: orderId,
      rating: Number(rating),
      comment,
    });

    // Update Product average rating
    const productReviews = await Review.find({ product: productId });
    const avgProdRating =
      productReviews.reduce((acc, item) => item.rating + acc, 0) / productReviews.length;
    product.rating = Math.round(avgProdRating * 10) / 10;
    product.numReviews = productReviews.length;
    await product.save();

    // Update Farmer average rating
    const farmerReviews = await Review.find({ farmer: product.farmer });
    const avgFarmerRating =
      farmerReviews.reduce((acc, item) => item.rating + acc, 0) / farmerReviews.length;
    await User.findByIdAndUpdate(product.farmer, {
      rating: Math.round(avgFarmerRating * 10) / 10,
      numReviews: farmerReviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
};
