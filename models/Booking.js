const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    bookingType: {
      type: String,
      enum: ['tour', 'hotel', 'flight', 'car'],
      required: [true, 'Please specify booking type'],
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    guests: {
      type: Number,
      default: 1,
    },
    rooms: {
      type: Number,
      default: 1,
    },
    passengers: [
      {
        name: String,
        age: Number,
        seatNumber: String,
      },
    ],
    pickupLocation: {
      type: String,
    },
    dropLocation: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please add total amount'],
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: [true, 'Please add final amount'],
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'paypal', 'cod'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    cancellationReason: {
      type: String,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
