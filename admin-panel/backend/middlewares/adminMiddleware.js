// middleware/adminMiddleware.js
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // Find the user by ID (set by previous authMiddleware)
    const user = await User.findById(req.user.id);

    // Check if user exists and has admin role
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify user is an Admin
    if (user.role !== 'Admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        userRole: user.role 
      });
    }

    // User is an admin, proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

module.exports = adminMiddleware;