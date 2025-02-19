import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (professional only)
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'professional') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.userId);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user role (professional only)
router.patch('/:id/role', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'professional') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'professional' ? 'standard' : 'professional';
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (professional only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'professional') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (currentUser.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;