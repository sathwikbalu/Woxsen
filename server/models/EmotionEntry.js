import mongoose from 'mongoose';

const emotionEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emotion: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Angry', 'Surprise', 'Fear', 'Disgust', 'Neutral'],
  },
  imageUrl: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('EmotionEntry', emotionEntrySchema);