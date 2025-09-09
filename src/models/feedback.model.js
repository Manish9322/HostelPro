
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;

    