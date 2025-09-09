
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  submittedAt: { type: Date, default: Date.now },
  complaintSubject: { type: String, required: true },
  complaintText: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  category: {
    type: String,
    enum: ['Maintenance', 'Noise', 'Safety', 'Harassment', 'Other', 'Uncategorized'],
    default: 'Uncategorized',
  },
  urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'Unknown'],
    default: 'Unknown',
  },
  summary: { type: String }
}, { timestamps: true });

const ComplaintModel = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);

export default ComplaintModel;
