import mongoose from "mongoose";

const gratitudeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: [
      "Extremely Happy",
      "Very Happy",
      "Happy",
      "Neutral",
      "Sad",
      "Very Sad",
      "Extremely Sad",
    ],
    default: "Neutral",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GratitudeEntry", gratitudeEntrySchema);
