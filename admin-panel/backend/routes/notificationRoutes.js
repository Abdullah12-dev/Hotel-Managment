const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);
router.use(logMiddleware);


// Route for sending notifications
router.post('/send', sendNotification);

module.exports = router;
