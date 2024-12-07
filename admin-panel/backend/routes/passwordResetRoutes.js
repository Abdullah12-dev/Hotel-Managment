const express = require('express');
const User = require('../models/User'); // assuming this path for the model
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Helper function to generate a 5-digit code
const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000); // 5-digit code
};

// Forgot Password - Send verification code
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;  // Destructure the email from the body

  // Check if the email exists in the database
  const user = await User.findOne({ email: email.email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Generate a 5-digit verification code
  const verificationCode = generateVerificationCode();

  // Store the code and its expiration time in the user's document
  user.passwordResetCode = verificationCode;
  user.passwordResetExpires = Date.now() + 3600000; // expires in 1 hour
  await user.save();

  // Send email with the verification code
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: 'Password Reset Request',
    text: `Please use the following 5-digit code to reset your password: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'Password reset code sent to your email' });
  });
});

// Reset Password - Verify code and reset password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  // Find the user by email
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }


  // Check if the code is valid and hasn't expired
  if (user.passwordResetCode !== code || Date.now() > user.passwordResetExpires) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.passwordResetCode = undefined; // Clear the reset code
  user.passwordResetExpires = undefined; // Clear the reset expiration
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});

module.exports = router;
