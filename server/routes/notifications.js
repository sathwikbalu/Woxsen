// import express from "express";
// import auth from "../middleware/auth.js";
// import Notification from "../models/Notification.js";
// import schedule from "node-schedule";

// const router = express.Router();

// const dailyMessages = [
//   "Take a moment to breathe deeply and center yourself.",
//   "Remember to stay hydrated and take care of your body today.",
//   "You're stronger than you think. Keep moving forward.",
//   "Take breaks when needed - it's okay to rest.",
//   "Celebrate small wins - they add up to big achievements.",
//   "Your mental health matters. How are you feeling today?",
//   "Remember to practice self-compassion today.",
//   "Take a moment to appreciate something beautiful around you.",
//   "Your journey is unique - embrace your own pace.",
//   "Don't forget to stretch and move your body today.",
//   "You're doing better than you think you are.",
//   "Take time to connect with someone you care about today.",
//   "Remember to be kind to yourself.",
//   "Every day is a new opportunity to grow.",
//   "Your feelings are valid - acknowledge them without judgment.",
// ];

// router.get("/", auth, async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       userId: req.user.userId,
//       scheduledFor: { $lte: new Date() },
//       isRead: false,
//     }).sort({ scheduledFor: -1 });
//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.patch("/:id/read", auth, async (req, res) => {
//   try {
//     const notification = await Notification.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.userId },
//       { isRead: true },
//       { new: true }
//     );
//     res.json(notification);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// const scheduleDailyNotification = async (userId) => {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const randomMessage =
//     dailyMessages[Math.floor(Math.random() * dailyMessages.length)];

//   const notification = new Notification({
//     userId,
//     message: randomMessage,
//     type: "daily",
//     scheduledFor: tomorrow,
//   });

//   await notification.save();
// };

// schedule.scheduleJob("0 0 * * *", async () => {
//   try {
//     const users = await User.find();
//     await Promise.all(users.map((user) => scheduleDailyNotification(user._id)));
//   } catch (error) {
//     console.error("Error scheduling notifications:", error);
//   }
// });

// export default router;

import express from "express";
import auth from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get user's notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
      scheduledFor: { $lte: new Date() },
    })
      .sort({ scheduledFor: -1 })
      .limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new notification (for testing)
router.post("/", auth, async (req, res) => {
  try {
    const { message, type, scheduledFor } = req.body;

    const notification = new Notification({
      userId: req.user.userId,
      message,
      type,
      scheduledFor: scheduledFor || new Date(),
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
