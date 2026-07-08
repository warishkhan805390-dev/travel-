const Tour = require('../models/Tour');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

exports.getTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = Tour.find({
        $or: [
          { title: searchRegex },
          { destination: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    if (req.query.destination) {
      query = query.where('destination').equals(req.query.destination);
    }
    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }

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

    const tours = await query;
    const total = await Tour.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: tours.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: tours,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isFeatured: true }).sort('-createdAt').limit(8);
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPopularTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isPopular: true }).sort('-ratingsAverage').limit(8);
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug });
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    await tour.deleteOne();
    res.status(200).json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadTourImages = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const images = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'travel-booking/tours',
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.log('Cloudinary upload error:', uploadError);
        images.push(`/uploads/${file.filename}`);
      }
    }
    tour.images = [...tour.images, ...images];
    if (!tour.thumbnail && images.length > 0) {
      tour.thumbnail = images[0];
    }
    await tour.save();
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
