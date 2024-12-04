const express = require('express');
const router = express.Router();
const hotelStatsController = require('../controllers/hotelStatsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);
router.use(logMiddleware);

router.get('/summary', hotelStatsController.getSummaryStats);

// Detailed Bookings for Reports
router.get('/bookings', hotelStatsController.getBookingDetails);

module.exports = router;
