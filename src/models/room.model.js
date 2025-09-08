import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  occupancy: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Under Maintenance'],
    default: 'Available',
    required: true,
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good',
    required: true,
  },
  utilities: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const RoomModel = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default RoomModel;
