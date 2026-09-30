const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user (Buyer or Farmer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      farmName,
      farmSize,
      farmingType,
      crops,
      street,
      city,
      state,
      pincode,
    } = req.body;

    const cleanEmail = (email || '').toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const requestedRole = ['farmer', 'buyer'].includes(role) ? role : 'buyer';

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      phone,
      role: requestedRole,
      address: { street, city, state, pincode, country: 'India' },
      farmName: requestedRole === 'farmer' ? farmName || `${name}'s Organic Farm` : '',
      farmSize: requestedRole === 'farmer' ? farmSize || '2 Acres' : '',
      farmingType: requestedRole === 'farmer' ? farmingType || 'Organic' : '',
      crops: requestedRole === 'farmer' && Array.isArray(crops) ? crops : [],
      verificationStatus: requestedRole === 'farmer' ? 'PENDING' : 'NONE',
    });

    // Create Audit Log
    await AuditLog.create({
      user: user._id,
      action: 'USER_REGISTER',
      entity: 'User',
      entityId: user._id.toString(),
      metadata: { role: user.role, email: user.email },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        farmName: user.farmName,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
      });
    }

    await AuditLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      metadata: { role: user.role },
    });

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        farmName: user.farmName,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, farmName, farmSize, farmingType, address } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (user.role === 'farmer') {
      if (farmName) user.farmName = farmName;
      if (farmSize) user.farmSize = farmSize;
      if (farmingType) user.farmingType = farmingType;
    }
    if (address) {
      user.address = { ...user.address, ...address };
    }

    if (req.file) {
      // Image uploaded locally or via Cloudinary
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
