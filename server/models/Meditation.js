import mongoose from 'mongoose';

const meditationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  duration: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: String,
  audioUrl: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
});

export default mongoose.model('Meditation', meditationSchema);