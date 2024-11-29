const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  checkInDetails: {
    receptionist: { type: Schema.Types.ObjectId, ref: 'User' },
    checkInTime: { type: Date, default: Date.now },
  },
  checkOutDetails: {
    receptionist: { type: Schema.Types.ObjectId, ref: 'User' },
    checkOutTime: { type: Date },
    settledAmount: { type: Number },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
});

module.exports = mongoose.model('Booking', BookingSchema);
