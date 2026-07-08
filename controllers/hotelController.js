const Hotel = require('../models/Hotel');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

exports.searchHotels = async (req, res) => {
  try {
    const { destination, checkIn, checkOut, guests } = req.query;
    const query = {};
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    const hotels = await Hotel.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Hotel.find(JSON.parse(queryStr));

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

    const hotels = await query;
    const total = await Hotel.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isFeatured: true }).sort('-createdAt').limit(8);
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHotelBySlug = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    await hotel.deleteOne();
    res.status(200).json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadHotelImages = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const images = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'travel-booking/hotels',
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        images.push(`/uploads/${file.filename}`);
      }
    }
    hotel.images = [...hotel.images, ...images];
    if (!hotel.thumbnail && images.length > 0) {
      hotel.thumbnail = images[0];
    }
    await hotel.save();
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
