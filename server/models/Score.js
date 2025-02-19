import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Score", scoreSchema);
