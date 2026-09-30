const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getPendingVerifications,
  reviewVerification,
  getUsers,
  toggleUserStatus,
  getAuditLogs,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/verifications', getPendingVerifications);
router.patch('/verifications/:farmerId', reviewVerification);
router.get('/users', getUsers);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
