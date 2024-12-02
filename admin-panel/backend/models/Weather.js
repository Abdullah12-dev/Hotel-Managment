const mongoose = require('mongoose');
const { Schema } = mongoose;

const WeatherSchema = new Schema({
  location: { type: String, required: true },
  forecast: { type: Object },
  fetchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Weather', WeatherSchema);
