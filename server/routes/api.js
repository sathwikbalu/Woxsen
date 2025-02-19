import express from "express";
import auth from "../middleware/auth.js";
import MoodEntry from "../models/MoodEntry.js";
import GratitudeEntry from "../models/GratitudeEntry.js";
import DailyCheckin from "../models/DailyCheckin.js";
import Meditation from "../models/Meditation.js";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import goalRoutes from "./goals.js";
import mongoose from "mongoose";

const router = express.Router();

router.use("/goals", goalRoutes);

router.get("/dashboard/stats", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const activeUsers = await User.countDocuments({
      lastLoginDate: { $gte: thirtyDaysAgo },
    });

    const previousActiveUsers = await User.countDocuments({
      lastLoginDate: {
        $gte: sixtyDaysAgo,
        $lt: thirtyDaysAgo,
      },
    });

    const activeUsersChange =
      previousActiveUsers > 0
        ? ((activeUsers - previousActiveUsers) / previousActiveUsers) * 100
        : 0;

    const currentMoodEntries = await MoodEntry.find({
      timestamp: { $gte: thirtyDaysAgo },
    });

    const previousMoodEntries = await MoodEntry.find({
      timestamp: {
        $gte: sixtyDaysAgo,
        $lt: thirtyDaysAgo,
      },
    });

    const avgMoodScore =
      currentMoodEntries.length > 0
        ? currentMoodEntries.reduce((acc, entry) => acc + entry.mood, 0) /
          currentMoodEntries.length
        : 0;

    const previousAvgMoodScore =
      previousMoodEntries.length > 0
        ? previousMoodEntries.reduce((acc, entry) => acc + entry.mood, 0) /
          previousMoodEntries.length
        : 0;

    const avgMoodScoreChange =
      previousAvgMoodScore > 0
        ? ((avgMoodScore - previousAvgMoodScore) / previousAvgMoodScore) * 100
        : 0;

    const currentCompletedGoals = await Goal.countDocuments({
      status: "completed",
      startDate: { $gte: thirtyDaysAgo },
    });

    const currentTotalGoals = await Goal.countDocuments({
      startDate: { $gte: thirtyDaysAgo },
    });

    const previousCompletedGoals = await Goal.countDocuments({
      status: "completed",
      startDate: {
        $gte: sixtyDaysAgo,
        $lt: thirtyDaysAgo,
      },
    });

    const previousTotalGoals = await Goal.countDocuments({
      startDate: {
        $gte: sixtyDaysAgo,
        $lt: thirtyDaysAgo,
      },
    });

    const goalCompletionRate =
      currentTotalGoals > 0
        ? (currentCompletedGoals / currentTotalGoals) * 100
        : 0;

    const previousGoalCompletionRate =
      previousTotalGoals > 0
        ? (previousCompletedGoals / previousTotalGoals) * 100
        : 0;

    const goalCompletionChange =
      previousGoalCompletionRate > 0
        ? ((goalCompletionRate - previousGoalCompletionRate) /
            previousGoalCompletionRate) *
          100
        : 0;

    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const dailyCheckins = await DailyCheckin.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const previousDay = new Date(startOfDay);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayEnd = new Date(previousDay);
    previousDayEnd.setHours(23, 59, 59, 999);

    const previousDailyCheckins = await DailyCheckin.countDocuments({
      date: {
        $gte: previousDay,
        $lte: previousDayEnd,
      },
    });

    const dailyCheckinsChange =
      previousDailyCheckins > 0
        ? ((dailyCheckins - previousDailyCheckins) / previousDailyCheckins) *
          100
        : 0;

    res.json({
      activeUsers,
      activeUsersChange,
      avgMoodScore,
      avgMoodScoreChange,
      goalCompletionRate,
      goalCompletionChange,
      dailyCheckins,
      dailyCheckinsChange,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard/usage-patterns", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patterns = await DailyCheckin.aggregate([
      {
        $group: {
          _id: { $hour: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          hour: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard/popular-features", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [moodCount, meditationCount, breathingCount] = await Promise.all([
      MoodEntry.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      Meditation.countDocuments(),
      DailyCheckin.countDocuments({ date: { $gte: thirtyDaysAgo } }),
    ]);

    const features = [
      { feature: "Mood Tracking", usageCount: moodCount },
      { feature: "Meditation", usageCount: meditationCount },
      { feature: "Breathing Exercises", usageCount: breathingCount },
    ].sort((a, b) => b.usageCount - a.usageCount);

    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard/mood-patterns", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== "professional") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patterns = await DailyCheckin.aggregate([
      {
        $unwind: "$activities",
      },
      {
        $group: {
          _id: "$activities",
          avgMoodChange: { $avg: { $subtract: ["$mood", 3] } },
        },
      },
      {
        $project: {
          activity: "$_id",
          avgMoodChange: 1,
          _id: 0,
        },
      },
      { $sort: { avgMoodChange: -1 } },
    ]);

    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/mood", auth, async (req, res) => {
  try {
    const entry = new MoodEntry({
      userId: req.user.userId,
      ...req.body,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/mood", auth, async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.user.userId }).sort({
      timestamp: -1,
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/gratitude", auth, async (req, res) => {
  try {
    const entry = new GratitudeEntry({
      userId: req.user.userId,
      ...req.body,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/gratitude", auth, async (req, res) => {
  try {
    const entries = await GratitudeEntry.find({ userId: req.user.userId }).sort(
      { date: -1 }
    );
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/checkins", auth, async (req, res) => {
  try {
    const checkin = new DailyCheckin({
      userId: req.user.userId,
      ...req.body,
    });
    await checkin.save();
    res.status(201).json(checkin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/checkins", auth, async (req, res) => {
  try {
    const checkins = await DailyCheckin.find({ userId: req.user.userId }).sort({
      date: -1,
    });
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/meditations", auth, async (req, res) => {
  try {
    const { category, level } = req.query;
    const query = {};
    if (category) query.category = category;
    if (level) query.level = level;

    const meditations = await Meditation.find(query);
    res.json(meditations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/weekly-checkins/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Fetch the last 7 check-ins, sorted by date in descending order
    const checkins = await DailyCheckin.find({ userId })
      .sort({ date: -1 }) // Sort by latest first
      .limit(7); // Get last 7 entries

    if (!checkins.length) {
      return res.status(404).json({
        message: "No check-ins found.",
        paragraph: "No check-ins available.",
      });
    }

    // Initialize aggregators
    let totalMood = 0,
      totalSleepHours = 0,
      totalSleepQuality = 0,
      totalAnxiety = 0,
      totalStress = 0,
      activityCount = 0;
    const activities = new Set();
    const notes = [];

    // Aggregate data from check-ins
    checkins.forEach((checkin) => {
      totalMood += checkin.mood || 0;
      totalSleepHours += checkin.sleep?.hours || 0;
      totalSleepQuality += checkin.sleep?.quality || 0;
      totalAnxiety += checkin.anxiety || 0;
      totalStress += checkin.stress || 0;

      if (Array.isArray(checkin.activities)) {
        checkin.activities.forEach((activity) => activities.add(activity));
        activityCount += checkin.activities.length;
      }

      if (checkin.notes) notes.push(checkin.notes);
    });

    // Calculate averages
    const daysCount = checkins.length;

    const paragraph = `
      Over the last ${daysCount} check-ins, you reported an average mood score of ${(
      totalMood / daysCount
    ).toFixed(1)}.
      Your sleep quality averaged ${(totalSleepQuality / daysCount).toFixed(
        1
      )} out of 5, 
      with an average sleep duration of ${(totalSleepHours / daysCount).toFixed(
        1
      )} hours per night.
      Anxiety and stress levels were ${(totalAnxiety / daysCount).toFixed(
        1
      )} and ${(totalStress / daysCount).toFixed(1)} respectively.
      You engaged in ${activityCount} activities, including: ${
      Array.from(activities).join(", ") || "None"
    }.
      Additional notes: "${notes.join('", "') || "None"}".
    `.trim();

    totalSleepQuality = totalSleepQuality / daysCount;
    totalMood = totalMood / daysCount;
    totalStress = totalStress / daysCount;
    totalAnxiety = totalAnxiety / daysCount;
    res.json({
      paragraph,
      totalSleepQuality,
      totalMood,
      totalAnxiety,
      totalStress,
      activityCount,
    });
  } catch (error) {
    console.error("Error in /weekly-checkins:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
