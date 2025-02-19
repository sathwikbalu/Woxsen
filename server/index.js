import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./middleware/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import apiRoutes from "./routes/api.js";
import messageRoutes from "./routes/messages.js";
import chatRoutes from "./routes/Pchat.js";
import gratitudeRoutes from "./routes/gratitude.js";
import notificationRoutes from "./routes/notifications.js";
import Score from "./models/Score.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true, // Include credentials like cookies if needed
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", apiRoutes);
app.options("*", cors()); // Allow preflight requests

app.post("/api/submit-score", auth, async (req, res) => {
  const score = req.body.score;
  try {
    const newScore = new Score({ userId: req.user.userId, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving score" });
  }
});

// Get User's Scores (authd)
app.get("/api/scores", auth, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.userId }).sort({
      timestamp: 1,
    });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching scores" });
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId, targetId }) => {
    const room = [userId, targetId].sort().join("-");
    socket.join(room);
  });

  socket.on("leave", ({ userId, targetId }) => {
    const room = [userId, targetId].sort().join("-");
    socket.leave(room);
  });

  socket.on("message", (message) => {
    const room = [message.senderId, message.receiverId].sort().join("-");
    io.to(room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
