import mongoose from 'mongoose';

const dailyCheckinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  sleep: {
    hours: Number,
    quality: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  anxiety: {
    type: Number,
    min: 1,
    max: 5,
  },
  stress: {
    type: Number,
    min: 1,
    max: 5,
  },
  activities: [{
    type: String,
  }],
  notes: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('DailyCheckin', dailyCheckinSchema);