const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'farmer', 'admin'],
      default: 'buyer',
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      pincode: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'NONE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Farmer specific details
    farmName: { type: String, default: '' },
    farmSize: { type: String, default: '' }, // e.g. "5 Acres"
    farmingType: { type: String, default: 'Organic' }, // e.g. Organic, Conventional, Hydroponic
    crops: [{ type: String }],
    verificationDocuments: [
      {
        docType: { type: String }, // e.g. Land Records, Aadhaar, Kisaan Credit Card
        docUrl: { type: String },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
