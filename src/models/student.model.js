import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  roomNumber: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1, max: 5 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  avatar: { type: String, default: null },
  dob: { type: Date },
  gender: { type: String },
  address: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
}, { timestamps: true });

const StudentModel = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default StudentModel;
