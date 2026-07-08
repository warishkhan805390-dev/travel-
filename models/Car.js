const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add car name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add brand'],
    },
    model: {
      type: String,
      required: [true, 'Please add model'],
    },
    year: {
      type: Number,
    },
    images: [String],
    thumbnail: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['suv', 'sedan', 'luxury', 'hatchback'],
      required: [true, 'Please add car type'],
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'manual',
    },
    seats: {
      type: Number,
      required: [true, 'Please add number of seats'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please add price per day'],
    },
    fuelType: {
      type: String,
    },
    mileage: {
      type: String,
    },
    isDriverAvailable: {
      type: Boolean,
      default: false,
    },
    isSelfDrive: {
      type: Boolean,
      default: true,
    },
    destination: {
      type: String,
      required: [true, 'Please add destination'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    features: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
