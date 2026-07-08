const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  facebookLogin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword,
  verifyEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/facebook-login', facebookLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/verify-email/:id', verifyEmail);

module.exports = router;
