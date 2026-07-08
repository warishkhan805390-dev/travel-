const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    airline: {
      type: String,
      required: [true, 'Please add airline name'],
    },
    flightNumber: {
      type: String,
      required: [true, 'Please add flight number'],
      unique: true,
    },
    logo: {
      type: String,
    },
    departureCity: {
      type: String,
      required: [true, 'Please add departure city'],
    },
    arrivalCity: {
      type: String,
      required: [true, 'Please add arrival city'],
    },
    departureAirport: {
      type: String,
      required: [true, 'Please add departure airport'],
    },
    arrivalAirport: {
      type: String,
      required: [true, 'Please add arrival airport'],
    },
    departureTime: {
      type: String,
      required: [true, 'Please add departure time'],
    },
    arrivalTime: {
      type: String,
      required: [true, 'Please add arrival time'],
    },
    duration: {
      type: String,
      required: [true, 'Please add duration'],
    },
    date: {
      type: Date,
      required: [true, 'Please add flight date'],
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
    },
    seatsAvailable: {
      type: Number,
      required: [true, 'Please add available seats'],
    },
    seatClass: {
      type: String,
      enum: ['economy', 'business', 'first'],
      default: 'economy',
    },
    stops: {
      type: Number,
      default: 0,
    },
    amenities: [String],
    baggage: {
      type: String,
    },
    cancellationPolicy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Flight', flightSchema);
