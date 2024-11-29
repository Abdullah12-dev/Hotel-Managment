const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Single', 'Deluxe', 'Suite'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  description: { type: String },
  nextAvailableTime: { type: Date },
  images: [String],
});

module.exports = mongoose.model('Room', RoomSchema);
