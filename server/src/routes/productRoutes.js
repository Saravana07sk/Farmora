const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:identifier', getProductByIdentifier);

router.post(
  '/',
  authenticate,
  authorize('farmer', 'admin'),
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('farmer', 'admin'),
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', authenticate, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;
