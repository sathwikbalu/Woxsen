import express from "express";
import auth from "../middleware/auth.js";
import Goal from "../models/Goal.js";

const router = express.Router();

// Get all goals for user
router.get("/", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new goal
router.post("/", auth, async (req, res) => {
  try {
    const goal = new Goal({
      userId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      targetDays: req.body.targetDays,
      completedDays: 0,
      status: "active",
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update goal progress
router.patch("/:id/progress", auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.completedDays += 1;
    if (goal.completedDays >= goal.targetDays) {
      goal.status = "completed";
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
