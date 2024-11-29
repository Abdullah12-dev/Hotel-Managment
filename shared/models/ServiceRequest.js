const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceRequestSchema = new Schema({
  guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  requestDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
