require('dotenv').config();
const nodemailer = require('nodemailer');



// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USERNAME, // Set in environment variables
    pass: process.env.EMAIL_PASSWORD, // Set in environment variables
  },
});

// Function to send email
exports.sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};
