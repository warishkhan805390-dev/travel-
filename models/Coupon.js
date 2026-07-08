const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add coupon code'],
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Please add discount type'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Please add discount value'],
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Coupon', couponSchema);
