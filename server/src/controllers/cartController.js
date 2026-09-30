const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { calculateOrderTotals } = require('../utils/pricing');

// @desc    Get buyer's cart with live transparent price breakdown
// @route   GET /api/cart
// @access  Private (Buyer)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ buyer: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'farmer', select: 'name farmName isVerified rating' },
    });

    if (!cart) {
      cart = await Cart.create({ buyer: req.user._id, items: [] });
    }

    // Filter out inactive or deleted products
    const validItems = cart.items.filter((item) => item.product && item.product.status === 'active');
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const calculatedItems = cart.items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      unit: item.product.unit,
      quantity: item.quantity,
      image: item.product.images[0],
      farmer: item.product.farmer,
      quantityAvailable: item.product.quantityAvailable,
      minimumOrderQuantity: item.product.minimumOrderQuantity,
    }));

    const totals = calculateOrderTotals(calculatedItems);

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        calculatedItems,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (Buyer)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Product is no longer available' });
    }

    const requestedQty = Number(quantity) || 1;
    if (requestedQty < product.minimumOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity for ${product.name} is ${product.minimumOrderQuantity} ${product.unit}`,
      });
    }

    if (requestedQty > product.quantityAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantityAvailable} ${product.unit} available in stock`,
      });
    }

    let cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) {
      cart = await Cart.create({ buyer: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newTotalQty = cart.items[existingIndex].quantity + requestedQty;
      if (newTotalQty > product.quantityAvailable) {
        return res.status(400).json({
          success: false,
          message: `Cannot exceed available stock of ${product.quantityAvailable} ${product.unit}`,
        });
      }
      cart.items[existingIndex].quantity = newTotalQty;
    } else {
      cart.items.push({ product: productId, quantity: requestedQty });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Added to cart successfully.',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private (Buyer)
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
    }

    let cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (qty > item.product.quantityAvailable) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.product.quantityAvailable} ${item.product.unit} available`,
      });
    }

    item.quantity = qty;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated.',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private (Buyer)
const removeCartItem = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
