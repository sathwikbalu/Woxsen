
const mongoose = require('mongoose');

const userHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  steps: Number,
  heartRate: Number,
  sleep: Array,
  distance: Number,
  calories: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserHealthData', userHealthSchema);
