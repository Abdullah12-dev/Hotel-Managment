const express = require('express');
const Settings = require('../models/Settings');  // Assuming the path for Settings schema
const router = express.Router();

// Get current settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        policy: '', // Default empty policy
        notificationPreferences: { email: true, sms: true },
      });
      await settings.save();
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update settings (policy & notification preferences)
router.put('/', async (req, res) => {
  try {
    const { policy, notificationPreferences } = req.body;

    // Fetch and update settings
    const settings = await Settings.findOneAndUpdate(
      {},
      { policy, notificationPreferences, updatedAt: Date.now() },
      { new: true }
    );

    if (!settings) {
      return res.status(400).json({ message: 'Settings not found' });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Reset settings to default
router.delete('/', async (req, res) => {
  try {
    const defaultSettings = {
      policy: '',
      notificationPreferences: { email: true, sms: true },
    };

    const settings = await Settings.findOneAndUpdate(
      {},
      defaultSettings,
      { new: true }
    );

    if (!settings) {
      return res.status(400).json({ message: 'Settings not found' });
    }

    res.status(200).json({ message: 'Settings reset to default', settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting settings' });
  }
});

module.exports = router;
