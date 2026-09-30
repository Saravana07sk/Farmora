const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// @desc    Get Admin Marketplace Analytics & Statistics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const verifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: true });
    const pendingVerifications = await User.countDocuments({
      role: 'farmer',
      verificationStatus: 'PENDING',
    });

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });

    const totalOrders = await Order.countDocuments();

    // Gross Merchandise Value (GMV) & Total Platform Commission Collected
    const orderAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: null,
          totalGMV: { $sum: '$totalAmount' },
          totalPlatformCommission: { $sum: '$platformFee' },
          totalSubtotal: { $sum: '$subtotal' },
        },
      },
    ]);

    const gmv = orderAgg.length > 0 ? orderAgg[0].totalGMV : 0;
    const platformCommission = orderAgg.length > 0 ? orderAgg[0].totalPlatformCommission : 0;

    // Category distribution
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Monthly GMV & Commission trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'CANCELLED' },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          gmv: { $sum: '$totalAmount' },
          commission: { $sum: '$platformFee' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyStats = monthlyStats.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      gmv: item.gmv,
      commission: item.commission,
      orders: item.orders,
    }));

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          buyers: totalBuyers,
          verifiedFarmers,
          pendingVerifications,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
        },
        financials: {
          gmv,
          platformCommission,
          totalOrders,
        },
        categoryBreakdown,
        monthlyStats: formattedMonthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmers for verification review
// @route   GET /api/admin/verifications
// @access  Private (Admin)
const getPendingVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { role: 'farmer' };
    if (status) filter.verificationStatus = status;
    else filter.verificationStatus = 'PENDING';

    const farmers = await User.find(filter).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: farmers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review & Update farmer verification status
// @route   PATCH /api/admin/verifications/:farmerId
// @access  Private (Admin)
const reviewVerification = async (req, res, next) => {
  try {
    const { action } = req.body; // 'APPROVE' or 'REJECT'
    const { farmerId } = req.params;

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer account not found' });
    }

    if (action === 'APPROVE') {
      farmer.isVerified = true;
      farmer.verificationStatus = 'APPROVED';

      // Mark all existing products of this farmer as verified
      await Product.updateMany({ farmer: farmerId }, { isVerified: true });

      await Notification.create({
        user: farmer._id,
        title: 'Verification Approved! 🎉',
        message: 'Your farmer profile has been officially verified! You now display the Verified Farmer badge.',
        type: 'verification',
        link: '/farmer/profile',
      });
    } else if (action === 'REJECT') {
      farmer.isVerified = false;
      farmer.verificationStatus = 'REJECTED';

      await Product.updateMany({ farmer: farmerId }, { isVerified: false });

      await Notification.create({
        user: farmer._id,
        title: 'Verification Request Update ⚠️',
        message: 'Your verification request was rejected. Please review and re-submit valid documents.',
        type: 'verification',
        link: '/farmer/verification',
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Use APPROVE or REJECT.' });
    }

    await farmer.save();

    await AuditLog.create({
      user: req.user._id,
      action: `VERIFICATION_${action}`,
      entity: 'User',
      entityId: farmer._id.toString(),
      metadata: { farmerName: farmer.name, email: farmer.email },
    });

    res.json({
      success: true,
      message: `Farmer verification has been ${action.toLowerCase()}d.`,
      data: farmer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform users with role filter & pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { farmName: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    res.json({
      success: true,
      data: users,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (Suspend / Reactivate)
// @route   PATCH /api/admin/users/:userId/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
      user: req.user._id,
      action: user.isActive ? 'USER_REACTIVATE' : 'USER_SUSPEND',
      entity: 'User',
      entityId: user._id.toString(),
    });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'reactivated' : 'suspended'} successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Platform Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: logs,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getPendingVerifications,
  reviewVerification,
  getUsers,
  toggleUserStatus,
  getAuditLogs,
};
