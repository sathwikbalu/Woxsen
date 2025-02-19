import express from "express";
import auth from "../middleware/auth.js";
import GratitudeEntry from "../models/GratitudeEntry.js";
import User from "../models/User.js";
const router = express.Router();

// Get paginated gratitude entries
router.get("/", auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const entries = await GratitudeEntry.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await GratitudeEntry.countDocuments({
      userId: req.user.userId,
    });

    res.json({
      entries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new gratitude entry
router.post("/", auth, async (req, res) => {
  try {
    const { content, sentiment } = req.body;

    const entry = new GratitudeEntry({
      userId: req.user.userId,
      content,
      sentiment: sentiment || "Neutral",
      date: new Date()
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/sad-users", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find users with extremely sad entries in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sadEntries = await GratitudeEntry.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
          sentiment: "Extremely Sad",
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $group: {
          _id: "$userId",
          lastEntry: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$user._id",
          name: "$user.name",
          lastEntry: {
            content: "$lastEntry.content",
            date: "$lastEntry.date",
            sentiment: "$lastEntry.sentiment",
          },
        },
      },
    ]);

    res.json(sadEntries);
  } catch (error) {
    console.error("Error fetching sad users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
