const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['SMS', 'Email'], required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Sent', 'Failed'], default: 'Sent' },
});

module.exports = mongoose.model('Notification', NotificationSchema);
