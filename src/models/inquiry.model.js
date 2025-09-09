
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  text: { type: String, trim: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Addressed', 'Dismissed'],
    default: 'Pending',
  },
  category: {
    type: String,
    enum: ['Question', 'Item Request', 'Room Change Request'],
  },
  // The following fields are no longer populated by AI
  summary: { type: String },
  urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
  },
  requestedItem: { type: String },
}, { timestamps: true });

const InquiryModel = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default InquiryModel;

    