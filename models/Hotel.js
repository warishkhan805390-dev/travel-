const mongoose = require('mongoose');
const slugify = require('slugify');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: [String],
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please add a base price'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    destination: {
      type: String,
      required: [true, 'Please add destination'],
    },
    address: {
      type: String,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    roomTypes: [
      {
        type: {
          type: String,
          enum: ['single', 'double', 'suite', 'deluxe'],
        },
        price: Number,
        available: Number,
        amenities: [String],
      },
    ],
    amenities: [String],
    policies: [String],
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
    location: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

hotelSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Hotel', hotelSchema);
