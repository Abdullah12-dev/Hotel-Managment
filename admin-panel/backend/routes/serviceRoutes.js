const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController'); // Adjust the import path as needed
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// Define routes for service management
router.post('/add', serviceController.addService);
router.put('/edit/:id', serviceController.editService);
router.delete('/delete/:id', serviceController.deleteService);
router.get('/all', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

module.exports = router;
