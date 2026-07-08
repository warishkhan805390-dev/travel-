const { sendEmail } = require('../utils/email');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }
    await sendEmail({
      email: process.env.SMTP_EMAIL || 'admin@travelbooking.com',
      subject: `Contact Form: ${subject}`,
      html: `<h1>New Contact Form Submission</h1>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    });
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
