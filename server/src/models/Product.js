const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    unit: {
      type: String,
      required: [true, 'Unit (e.g. kg, ton, quintal, crate, liter) is required'],
      default: 'kg',
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: [0.001, 'Minimum order quantity must be greater than 0'],
    },
    harvestDate: {
      type: Date,
      default: Date.now,
    },
    location: {
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    qualityGrade: {
      type: String,
      enum: ['Grade A+', 'Grade A', 'Grade B', 'Standard'],
      default: 'Grade A',
    },
    farmingMethod: {
      type: String,
      enum: ['Organic', 'Natural / Hydroponic', 'Conventional', 'Regenerative'],
      default: 'Organic',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'out_of_stock', 'suspended'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
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

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.index({ farmer: 1 });

module.exports = mongoose.model('Product', productSchema);
