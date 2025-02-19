import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import apiRoutes from "./routes/api.js";
import messageRoutes from "./routes/messages.js";
import chatRoutes from "./routes/Pchat.js";
import gratitudeRoutes from "./routes/gratitude.js";
import notificationRoutes from "./routes/notifications.js";
// import googleFitRoutes from "./routes/googleFit.js"
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://LOCALHOST:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
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
// app.use('/api/fit', googleFitRoutes);
app.use("/api", apiRoutes);

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
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
