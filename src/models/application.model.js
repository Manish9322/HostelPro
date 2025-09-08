
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1, max: 5 },
  roomPreference: { type: String, required: true },
  guardianName: { type: String, required: true, trim: true },
  guardianPhone: { type: String, required: true, trim: true },
  profilePhoto: { type: String, required: true },
  studentIdCard: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
    required: true
  },
  submittedAt: { type: Date, default: Date.now },
  roommatePreferences: {
    sleepSchedule: { type: String, enum: ['early-bird', 'night-owl'] },
    studyHabits: { type: String, enum: ['in-room', 'library', 'flexible'] },
    socialHabits: { type: String, enum: ['introvert', 'extrovert', 'ambivert'] }
  }
}, { timestamps: true });

const ApplicationModel = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default ApplicationModel;

    