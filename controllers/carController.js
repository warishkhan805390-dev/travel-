const Car = require('../models/Car');

exports.searchCars = async (req, res) => {
  try {
    const { destination, type, pickupDate, dropDate } = req.query;
    const query = {};
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    const cars = await Car.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Car.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const cars = await query;
    const total = await Car.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: cars,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ isFeatured: true }).sort('-createdAt').limit(8);
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    await car.deleteOne();
    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
