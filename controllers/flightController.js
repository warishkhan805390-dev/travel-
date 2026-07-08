const Flight = require('../models/Flight');

exports.searchFlights = async (req, res) => {
  try {
    const { departureCity, arrivalCity, date, passengers, seatClass } = req.query;
    const query = {};
    if (departureCity) {
      query.departureCity = { $regex: departureCity, $options: 'i' };
    }
    if (arrivalCity) {
      query.arrivalCity = { $regex: arrivalCity, $options: 'i' };
    }
    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999)),
      };
    }
    if (seatClass) {
      query.seatClass = seatClass;
    }
    if (passengers) {
      query.seatsAvailable = { $gte: parseInt(passengers) };
    }
    const flights = await Flight.find(query).sort({ price: 1 });
    res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFlights = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Flight.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort({ date: 1, departureTime: 1 });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const flights = await query;
    const total = await Flight.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: flights.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: flights,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.status(200).json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    let flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    await flight.deleteOne();
    res.status(200).json({ success: true, message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
