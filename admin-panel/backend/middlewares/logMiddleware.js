const SystemLog = require('../models/SystemLog'); // Adjust the path as needed

const logMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming `authMiddleware` attaches `user` to the request object
    const action = `${req.method} ${req.originalUrl}`; // Log HTTP method and route

    // Create a new log entry
    await SystemLog.create({
      user: userId,
      action: action,
      timestamp: new Date(),
    });

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error('Error logging system activity:', error.message);
    next(); // Ensure request processing continues even if logging fails
  }
};

module.exports = logMiddleware;
