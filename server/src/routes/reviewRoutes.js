const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, authorize('buyer'), createReview);

module.exports = router;
