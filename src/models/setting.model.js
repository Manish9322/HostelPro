
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  roomConditions: { type: [String], default: ["Excellent", "Good", "Fair", "Poor"] },
  roomUtilities: { type: [String], default: ["AC", "Wi-Fi", "Attached Bathroom", "Common Bathroom"] },
  inventoryCategories: { type: [String], default: ["Furniture", "Appliance", "Gym Equipment", "Safety", "Other"] },
  inventoryConditions: { type: [String], default: ["New", "Good", "Used", "Damaged"] },
  inventoryStatus: { type: [String], default: ["In Stock", "In Use", "Under Repair"] },
  complaintCategories: { type: [String], default: ["Maintenance", "Noise", "Safety", "Harassment", "Other"] },
  noticeCategories: { type: [String], default: ["General", "Maintenance", "Event", "Urgent"] },
}, { timestamps: true });

const SettingModel = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default SettingModel;
