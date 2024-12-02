const mongoose = require('mongoose');
const { Schema } = mongoose;

const SystemLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);
