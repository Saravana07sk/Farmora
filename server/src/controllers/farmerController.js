const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// @desc    Get Farmer Dashboard Analytics
// @route   GET /api/farmer/analytics
// @access  Private (Farmer)
const getFarmerAnalytics = async (req, res, next) => {
  try {
    const farmerId = req.user._id;

    // Total products & active listings
    const totalProducts = await Product.countDocuments({ farmer: farmerId });
    const activeProducts = await Product.countDocuments({ farmer: farmerId, status: 'active' });

    // Inventory sum
    const inventoryResult = await Product.aggregate([
      { $match: { farmer: farmerId } },
      { $group: { _id: null, totalStock: { $sum: '$quantityAvailable' } } },
    ]);
    const availableInventory = inventoryResult.length > 0 ? inventoryResult[0].totalStock : 0;

    // Orders metrics
    const farmerOrders = await Order.find({ farmer: farmerId });
    const totalOrdersCount = farmerOrders.length;
    const pendingOrdersCount = farmerOrders.filter((o) =>
      ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(o.orderStatus)
    ).length;

    // Total Revenue (excluding cancelled orders)
    const validOrders = farmerOrders.filter((o) => o.orderStatus !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((acc, o) => acc + (o.subtotal || 0), 0);

    // Sales by Product
    const topProducts = await Order.aggregate([
      { $match: { farmer: farmerId, orderStatus: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // Monthly Sales / Revenue Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Order.aggregate([
      {
        $match: {
          farmer: farmerId,
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
          revenue: { $sum: '$subtotal' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyTrends = monthlyTrends.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.orders,
    }));

    // Recent orders
    const recentOrders = await Order.find({ farmer: farmerId })
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders: totalOrdersCount,
          pendingOrders: pendingOrdersCount,
          activeProducts,
          totalProducts,
          availableInventory,
        },
        topProducts,
        monthlyTrends: formattedMonthlyTrends,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit farmer verification documents
// @route   POST /api/farmer/verification
// @access  Private (Farmer)
const submitVerification = async (req, res, next) => {
  try {
    const { farmName, farmSize, farmingType, crops, docType } = req.body;
    const user = await User.findById(req.user._id);

    if (farmName) user.farmName = farmName;
    if (farmSize) user.farmSize = farmSize;
    if (farmingType) user.farmingType = farmingType;
    if (crops) {
      user.crops = typeof crops === 'string' ? crops.split(',').map((c) => c.trim()) : crops;
    }

    let documentUrl = '';
    if (req.file) {
      documentUrl = `/uploads/${req.file.filename}`;
    }

    if (docType || documentUrl) {
      user.verificationDocuments.push({
        docType: docType || 'Land Records / Kisan ID',
        docUrl: documentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
        submittedAt: Date.now(),
      });
    }

    user.verificationStatus = 'PENDING';
    await user.save();

    // Notify Admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'Farmer Verification Request 📄',
        message: `${user.name} (${user.farmName || 'Farm'}) has submitted verification documents.`,
        type: 'verification',
        link: '/admin/verifications',
      });
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'VERIFICATION_SUBMIT',
      entity: 'User',
      entityId: user._id.toString(),
    });

    res.json({
      success: true,
      message: 'Verification information submitted successfully. Pending Admin review.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings belonging to current authenticated farmer
// @route   GET /api/farmer/products
// @access  Private (Farmer)
const getFarmerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .populate('farmer', 'name farmName rating numReviews isVerified verificationStatus profileImage address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmerAnalytics,
  submitVerification,
  getFarmerProducts,
};
