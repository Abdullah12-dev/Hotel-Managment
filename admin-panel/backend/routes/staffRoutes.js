const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);
router.use(logMiddleware);


router.post('/add', staffController.addStaff);
router.put('/edit/:id', staffController.editStaff);
router.delete('/delete/:id', staffController.deleteStaff);
router.patch('/assign-role/:id', staffController.assignRole);
router.get('/performance/:id', staffController.getPerformanceMetrics);
router.get('/all', staffController.getAllStaff);

module.exports = router;
