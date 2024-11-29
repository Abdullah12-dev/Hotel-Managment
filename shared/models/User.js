const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  phoneNumber: { type: String },
  role: { type: String, enum: ['Admin', 'Receptionist', 'Guest'], required: true },
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  providerId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
