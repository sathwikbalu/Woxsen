import express from "express";
import auth from "../middleware/auth.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

// Get all messages
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("userId", "name avatar role")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new message (professionals only)
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== "professional") {
      return res
        .status(403)
        .json({ message: "Only professionals can post messages" });
    }

    const message = new Message({
      userId: req.user.userId,
      content: req.body.content,
      attachments: req.body.attachments || [],
    });

    await message.save();
    await message.populate("userId", "name avatar role");
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Like/unlike a message
router.post("/:id/like", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const likeIndex = message.likes.indexOf(req.user.userId);
    if (likeIndex > -1) {
      message.likes.splice(likeIndex, 1);
    } else {
      message.likes.push(req.user.userId);
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete message (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
