const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});

module.exports = mongoose.model('Service', ServiceSchema);
