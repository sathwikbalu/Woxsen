import express from 'express';
import auth from '../middleware/auth.js';
import EmotionEntry from '../models/EmotionEntry.js';

const router = express.Router();

// Get emotion history
router.get('/', auth, async (req, res) => {
  try {
    const entries = await EmotionEntry.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save new emotion entry
router.post('/', auth, async (req, res) => {
  try {
    const { emotion, imageUrl } = req.body;
    const entry = new EmotionEntry({
      userId: req.user.userId,
      emotion,
      imageUrl,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;