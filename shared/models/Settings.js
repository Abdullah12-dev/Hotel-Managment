const mongoose = require('mongoose');
const { Schema } = mongoose;

const SettingsSchema = new Schema({
  policy: { type: String },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Settings', SettingsSchema);
