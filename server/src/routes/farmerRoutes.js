const express = require('express');
const router = express.Router();
const { getFarmerAnalytics, submitVerification, getFarmerProducts } = require('../controllers/farmerController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate, authorize('farmer', 'admin'));

router.get('/products', getFarmerProducts);
router.get('/analytics', getFarmerAnalytics);
router.post('/verification', upload.single('document'), submitVerification);

module.exports = router;
