const { sendEmail } = require('../utils/notificationUtils');
const Staff = require('../models/Staff'); // Adjust path if needed

// Controller function to send notifications
exports.sendNotification = async (req, res) => {
  try {
    const { staffId, email, phoneNumber, subject, message } = req.body;


    // Validate required fields
    if (!staffId || !email || !phoneNumber || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Verify staff member exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found.' });
    }

    // Send email and SMS notifications
    const emailResult = await sendEmail(email, subject, message);

    // Respond with success
    res.status(200).json({
      message: 'Notification sent successfully.',
      emailResult
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification.', error: error.message });
  }
};
