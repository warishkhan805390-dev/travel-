const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a tour title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    highlights: [String],
    images: [String],
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: [true, 'Please add duration'],
    },
    groupSize: {
      type: Number,
      default: 10,
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      enum: [
        'India', 'Dubai', 'Thailand', 'Maldives', 'Singapore',
        'Bali', 'Turkey', 'Europe', 'Switzerland', 'Paris',
        'London', 'Japan', 'Nepal', 'Kashmir', 'Goa',
        'Himachal', 'Rajasthan', 'Kerala',
      ],
    },
    category: {
      type: String,
      enum: [
        'adventure', 'honeymoon', 'religious', 'beach',
        'mountain', 'international', 'domestic',
      ],
      default: 'domestic',
    },
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        meals: [String],
      },
    ],
    included: [String],
    excluded: [String],
    hotelDetails: {
      name: String,
      stars: Number,
      roomType: String,
      amenities: [String],
    },
    transportDetails: {
      type: { type: String },
      description: String,
    },
    guide: {
      name: String,
      image: String,
      phone: String,
      languages: [String],
      rating: Number,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPopular: {
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
  },
  {
    timestamps: true,
  }
);

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
