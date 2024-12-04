const express = require('express');
const router = express.Router();
const systemLogController = require('../controllers/logController'); // Adjust the path as needed
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// Route to fetch all system logs
router.get('/all', systemLogController.getAllSystemLogs);

module.exports = router;
