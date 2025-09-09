
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Addressed', 'Dismissed'],
    default: 'Pending',
  },
  // AI-generated fields
  summary: { type: String },
  category: {
    type: String,
    enum: ['Question', 'Request'],
  },
  urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
  },
  requestedItem: { type: String },
}, { timestamps: true });

const InquiryModel = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default InquiryModel;
