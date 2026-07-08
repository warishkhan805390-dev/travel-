const Review = require('../models/Review');
const Tour = require('../models/Tour');
const Hotel = require('../models/Hotel');

exports.addReview = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const review = await Review.create(req.body);
    if (review.tour) {
      const stats = await Review.aggregate([
        { $match: { tour: review.tour, isApproved: true } },
        { $group: { _id: '$tour', avgRating: { $avg: '$rating' }, numRatings: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        await Tour.findByIdAndUpdate(review.tour, {
          ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
          ratingsQuantity: stats[0].numRatings,
        });
      }
    }
    if (review.hotel) {
      const stats = await Review.aggregate([
        { $match: { hotel: review.hotel, isApproved: true } },
        { $group: { _id: '$hotel', avgRating: { $avg: '$rating' }, numRatings: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        await Hotel.findByIdAndUpdate(review.hotel, {
          ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
          ratingsQuantity: stats[0].numRatings,
        });
      }
    }
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.tour) {
      const stats = await Review.aggregate([
        { $match: { tour: review.tour, isApproved: true } },
        { $group: { _id: '$tour', avgRating: { $avg: '$rating' }, numRatings: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        await Tour.findByIdAndUpdate(review.tour, {
          ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
          ratingsQuantity: stats[0].numRatings,
        });
      }
    }
    if (review.hotel) {
      const stats = await Review.aggregate([
        { $match: { hotel: review.hotel, isApproved: true } },
        { $group: { _id: '$hotel', avgRating: { $avg: '$rating' }, numRatings: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        await Hotel.findByIdAndUpdate(review.hotel, {
          ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
          ratingsQuantity: stats[0].numRatings,
        });
      }
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
