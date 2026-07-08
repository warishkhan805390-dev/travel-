const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: 'Welcome to TravelBooking',
    html: `<h1>Welcome ${user.name}!</h1><p>Thank you for joining TravelBooking. Start exploring amazing destinations now!</p>`,
  });
};

const sendBookingConfirmation = async (user, booking) => {
  await sendEmail({
    email: user.email,
    subject: 'Booking Confirmed - TravelBooking',
    html: `<h1>Booking Confirmed!</h1><p>Dear ${user.name},</p><p>Your booking (ID: ${booking._id}) has been confirmed.</p><p>Total Amount: $${booking.finalAmount}</p><p>Thank you for choosing TravelBooking!</p>`,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - TravelBooking',
    html: `<h1>Password Reset</h1><p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
  });
};

const sendOTPEmail = async (user, otp) => {
  await sendEmail({
    email: user.email,
    subject: 'Your OTP - TravelBooking',
    html: `<h1>Email Verification</h1><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendOTPEmail,
};
