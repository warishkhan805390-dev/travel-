const { body } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateCreateTour = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
];

const validateCreateHotel = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('destination').notEmpty().withMessage('Destination is required'),
];

const validateCreateBooking = [
  body('bookingType')
    .isIn(['tour', 'hotel', 'flight', 'car'])
    .withMessage('Invalid booking type'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('finalAmount').isNumeric().withMessage('Final amount must be a number'),
];

const validateAddReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .isLength({ max: 500 })
    .withMessage('Comment is required and must be under 500 characters'),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTour,
  validateCreateHotel,
  validateCreateBooking,
  validateAddReview,
};
