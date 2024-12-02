const mongoose = require('mongoose');
const { Schema } = mongoose;

const GuestDetailsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  preferences: { type: Object },
});

module.exports = mongoose.model('GuestDetails', GuestDetailsSchema);
