const SystemLog = require('../models/SystemLog'); // Adjust the import path as needed

// Fetch all system logs
exports.getAllSystemLogs = async (req, res) => {
    try {
        const logs = await SystemLog.find({}).populate('user', 'name email'); // Populate user details
        res.status(200).json({ logs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
