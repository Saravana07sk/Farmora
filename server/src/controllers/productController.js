const Product = require('../models/Product');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const slugify = require('slugify');

// @desc    Get all active products with search, filter, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      farmingMethod,
      qualityGrade,
      minPrice,
      maxPrice,
      locationState,
      verifiedOnly,
      sort,
      page = 1,
      limit = 12,
      farmer,
    } = req.query;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = { $in: ['active', 'out_of_stock'] };
    }
    if (farmer) {
      query.farmer = farmer;
    }

    // Text Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Farming Method Filter
    if (farmingMethod && farmingMethod !== 'All') {
      query.farmingMethod = farmingMethod;
    }

    // Quality Grade Filter
    if (qualityGrade && qualityGrade !== 'All') {
      query.qualityGrade = qualityGrade;
    }

    // Location Filter
    if (locationState && locationState !== 'All') {
      query['location.state'] = locationState;
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Verified Farmer Filter
    if (verifiedOnly === 'true') {
      query.isVerified = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'popularity') sortOptions = { views: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('farmer', 'name farmName rating numReviews isVerified verificationStatus profileImage address')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        total: totalProducts,
        page: pageNum,
        pages: Math.ceil(totalProducts / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:identifier
// @access  Public
const getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate(
        'farmer',
        'name email phone farmName farmSize farmingType rating numReviews isVerified profileImage address'
      );
    } else {
      product = await Product.findOne({ slug: identifier }).populate(
        'farmer',
        'name email phone farmName farmSize farmingType rating numReviews isVerified profileImage address'
      );
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Farmer only)
// @route   POST /api/products
// @access  Private (Farmer)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      unit,
      quantityAvailable,
      minimumOrderQuantity,
      harvestDate,
      qualityGrade,
      farmingMethod,
      state,
      city,
      images: bodyImages,
      imageUrl,
      status: bodyStatus,
    } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (Array.isArray(bodyImages) && bodyImages.length > 0) {
      imageUrls = bodyImages.filter(Boolean);
    } else if (typeof bodyImages === 'string' && bodyImages.trim()) {
      imageUrls = [bodyImages.trim()];
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      imageUrls = [imageUrl.trim()];
    } else {
      imageUrls = ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'];
    }

    const uniqueSlug = `${slugify(name, { lower: true, strict: true })}-${Date.now().toString().slice(-6)}`;

    const farmerUser = await User.findById(req.user._id);

    const qty = quantityAvailable !== undefined && quantityAvailable !== '' ? Number(quantityAvailable) : 50;
    const prodStatus = bodyStatus || (qty > 0 ? 'active' : 'out_of_stock');

    const product = await Product.create({
      farmer: req.user._id,
      name,
      slug: uniqueSlug,
      description,
      category,
      price: Number(price),
      unit: unit || 'kg',
      quantityAvailable: qty,
      minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
      harvestDate: harvestDate || Date.now(),
      qualityGrade: qualityGrade || 'Grade A',
      farmingMethod: farmingMethod || 'Organic',
      location: {
        state: state || farmerUser.address.state || 'Punjab',
        city: city || farmerUser.address.city || 'Ludhiana',
      },
      images: imageUrls,
      isVerified: farmerUser.isVerified,
      status: prodStatus,
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'PRODUCT_CREATE',
      entity: 'Product',
      entityId: product._id.toString(),
      metadata: { name: product.name, price: product.price },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Farmer or Admin)
// @route   PUT /api/products/:id
// @access  Private (Farmer/Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });
    }

    const {
      name,
      description,
      category,
      price,
      unit,
      quantityAvailable,
      minimumOrderQuantity,
      harvestDate,
      qualityGrade,
      farmingMethod,
      status,
      state,
      city,
      images: updateImages,
      imageUrl: updateImageUrl,
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (unit) product.unit = unit;
    if (quantityAvailable !== undefined) {
      product.quantityAvailable = Number(quantityAvailable);
      if (product.quantityAvailable <= 0) product.status = 'out_of_stock';
      else if (product.status === 'out_of_stock') product.status = 'active';
    }
    if (minimumOrderQuantity !== undefined) product.minimumOrderQuantity = Number(minimumOrderQuantity);
    if (harvestDate) product.harvestDate = harvestDate;
    if (qualityGrade) product.qualityGrade = qualityGrade;
    if (farmingMethod) product.farmingMethod = farmingMethod;
    if (status) product.status = status;
    if (state || city) {
      product.location = {
        state: state || product.location.state,
        city: city || product.location.city,
      };
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (Array.isArray(updateImages) && updateImages.length > 0) {
      product.images = updateImages.filter(Boolean);
    } else if (typeof updateImages === 'string' && updateImages.trim()) {
      product.images = [updateImages.trim()];
    } else if (updateImageUrl && typeof updateImageUrl === 'string' && updateImageUrl.trim()) {
      product.images = [updateImageUrl.trim()];
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Farmer or Admin)
// @route   DELETE /api/products/:id
// @access  Private (Farmer/Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    await AuditLog.create({
      user: req.user._id,
      action: 'PRODUCT_DELETE',
      entity: 'Product',
      entityId: req.params.id,
    });

    res.json({
      success: true,
      message: 'Product removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
};
