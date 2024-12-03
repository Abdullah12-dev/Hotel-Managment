const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController'); // Adjust the import path as needed
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// Define routes for room management
router.post('/add', roomController.addRoom);
router.put('/edit/:id', roomController.editRoom);
router.delete('/delete/:id', roomController.deleteRoom);
router.get('/all', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

module.exports = router;