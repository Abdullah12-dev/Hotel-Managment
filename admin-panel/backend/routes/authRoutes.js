// routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  login, 
  googleLogin, 
  register, 
  getCurrentUser 
} = require('../controllers/authController');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/signup', register);

// Protected routes (require authentication)
router.get('/me', authMiddleware,adminMiddleware, getCurrentUser);

module.exports = router;
