import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
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
  note: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MoodEntry', moodEntrySchema);