import express from "express";
import DailyCheckin from "../models/DailyCheckin";
import mongoose from "mongoose";

const router = express.Router();

// Route to get weekly insights for a user
router.get("/weekly-checkins/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Get the current date and calculate the start of the week
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Fetch daily check-ins for the past week
    const checkins = await DailyCheckin.find({
      userId,
      date: { $gte: oneWeekAgo, $lte: today },
    }).sort({ date: 1 });

    if (!checkins.length) {
      return res
        .status(404)
        .json({ message: "No check-ins found for this week." });
    }

    // Generate insights
    let totalMood = 0,
      totalSleepHours = 0,
      totalSleepQuality = 0;
    let totalAnxiety = 0,
      totalStress = 0,
      activityCount = 0;
    let activities = new Set();
    let notes = [];

    checkins.forEach((checkin) => {
      totalMood += checkin.mood;
      if (checkin.sleep?.hours) totalSleepHours += checkin.sleep.hours;
      if (checkin.sleep?.quality) totalSleepQuality += checkin.sleep.quality;
      if (checkin.anxiety) totalAnxiety += checkin.anxiety;
      if (checkin.stress) totalStress += checkin.stress;
      if (checkin.activities?.length) {
        checkin.activities.forEach((activity) => activities.add(activity));
        activityCount += checkin.activities.length;
      }
      if (checkin.notes) notes.push(checkin.notes);
    });

    const daysCount = checkins.length;

    const paragraph = `
      This week, you reported your mood with an average score of ${(
        totalMood / daysCount
      ).toFixed(1)}.
      Your sleep quality averaged ${(
        totalSleepQuality / daysCount || 0
      ).toFixed(1)} out of 5, 
      with an average sleep duration of ${(
        totalSleepHours / daysCount || 0
      ).toFixed(1)} hours per night.
      Anxiety and stress levels were ${(totalAnxiety / daysCount).toFixed(
        1
      )} and ${(totalStress / daysCount).toFixed(1)} respectively.
      You engaged in a total of ${activityCount} activities, which included: ${Array.from(
      activities
    ).join(", ")}.
      Additional notes you recorded include: "${notes.join('", "')}".
    `;

    res.json({ paragraph: paragraph.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
