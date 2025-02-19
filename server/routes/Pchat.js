import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import ChatMessage from "../models/Chat.js";

const router = express.Router();

// Get available users for chat
router.get("/users", auth, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select("name role avatar lastSeen");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get chat messages between two users
router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: req.user.userId, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a new message
router.post("/messages", auth, async (req, res) => {
  try {
    const { receiverId, content, status } = req.body;
    const message = new ChatMessage({
      senderId: req.user.userId,
      receiverId,
      content,
      status,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as delivered
router.patch("/messages/delivered/:userId", auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user.userId,
        status: "sent",
      },
      { status: "delivered" }
    );
    res.json({ message: "Messages marked as delivered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as seen
router.patch("/messages/seen/:userId", auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user.userId,
        status: { $in: ["sent", "delivered"] },
      },
      { status: "seen" }
    );
    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
