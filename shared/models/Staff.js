const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['Receptionist', 'Manager', 'Housekeeping'], required: true },
  performanceMetrics: {
    completedTasks: { type: Number, default: 0 },
    customerRatings: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Staff', StaffSchema);
