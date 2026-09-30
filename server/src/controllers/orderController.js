const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { calculateOrderTotals } = require('../utils/pricing');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items: directItems, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    let itemsToProcess = [];

    if (directItems && directItems.length > 0) {
      itemsToProcess = directItems;
    } else {
      const cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Your shopping cart is empty' });
      }
      itemsToProcess = cart.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
    }

    // Verify stock & build order items
    const orderItems = [];
    let primaryFarmerId = null;

    for (const item of itemsToProcess) {
      const product = await Product.findById(item.productId).populate('farmer');
      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product '${product ? product.name : 'Unknown'}' is no longer available.`,
        });
      }

      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantityAvailable}, Requested: ${item.quantity}`,
        });
      }

      primaryFarmerId = product.farmer._id;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        unit: product.unit,
        quantity: item.quantity,
        farmer: product.farmer._id,
      });

      // Deduct inventory
      product.quantityAvailable -= item.quantity;
      if (product.quantityAvailable === 0) {
        product.status = 'out_of_stock';
      }
      await product.save();
    }

    // Calculate totals transparently
    const pricing = calculateOrderTotals(orderItems);
    const orderNumber = `AGR-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
      buyer: req.user._id,
      farmer: primaryFarmerId,
      items: orderItems,
      subtotal: pricing.subtotal,
      platformFee: pricing.platformFee,
      deliveryFee: pricing.deliveryFee,
      totalAmount: pricing.totalAmount,
      shippingAddress: {
        name: shippingAddress.name || req.user.name,
        phone: shippingAddress.phone || req.user.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
      orderStatus: 'PLACED',
      statusHistory: [
        {
          status: 'PLACED',
          note: 'Order placed by buyer',
        },
      ],
    });

    // Clear buyer's cart
    await Cart.findOneAndUpdate({ buyer: req.user._id }, { items: [] });

    // Send notifications
    await Notification.create({
      user: primaryFarmerId,
      title: 'New Order Received! 🌾',
      message: `New order #${orderNumber} received for ₹${pricing.totalAmount}.`,
      type: 'order_placed',
      link: `/farmer/orders/${order._id}`,
    });

    await Notification.create({
      user: req.user._id,
      title: 'Order Placed Successfully! 🛒',
      message: `Your order #${orderNumber} has been placed successfully.`,
      type: 'order_placed',
      link: `/buyer/orders/${order._id}`,
    });

    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'ORDER_CREATE',
      entity: 'Order',
      entityId: order._id.toString(),
      metadata: { orderNumber, totalAmount: pricing.totalAmount },
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders (Buyer orders, Farmer orders, or Admin view)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    }

    const { status, page = 1, limit = 10 } = req.query;
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name farmName phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page: pageNum,
        pages: Math.ceil(totalOrders / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone address')
      .populate('farmer', 'name farmName phone email isVerified verificationStatus profileImage');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isFarmer = order.farmer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Farmer/Admin/Buyer for cancellation)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isFarmer = order.farmer.toString() === req.user._id.toString();
    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Status transition rules
    if (status === 'CANCELLED') {
      if (!isBuyer && !isFarmer && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel order' });
      }
      if (['DELIVERED', 'OUT_FOR_DELIVERY'].includes(order.orderStatus)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order once out for delivery or delivered' });
      }

      // Restore stock on cancellation
      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (prod) {
          prod.quantityAvailable += item.quantity;
          if (prod.status === 'out_of_stock' && prod.quantityAvailable > 0) {
            prod.status = 'active';
          }
          await prod.save();
        }
      }
    } else {
      if (!isFarmer && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only farmers or admins can update status' });
      }
    }

    order.orderStatus = status;
    if (status === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}`,
    });

    await order.save();

    // Send status notification to Buyer
    await Notification.create({
      user: order.buyer,
      title: `Order Update #${order.orderNumber}`,
      message: `Your order status is now: ${status.replace(/_/g, ' ')}.`,
      type: 'order_status',
      link: `/buyer/orders/${order._id}`,
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'ORDER_STATUS_UPDATE',
      entity: 'Order',
      entityId: order._id.toString(),
      metadata: { newStatus: status, orderNumber: order.orderNumber },
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
