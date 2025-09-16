
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  roomConditions: { type: [String], default: ["Excellent", "Good", "Fair", "Poor"] },
  inventoryCategories: { type: [String], default: ["Furniture", "Appliance", "Gym Equipment", "Safety", "Other"] },
  inventoryConditions: { type: [String], default: ["New", "Good", "Used", "Damaged"] },
  inventoryStatus: { type: [String], default: ["In Stock", "In Use", "Under Repair"] },
  complaintCategories: { type: [String], default: ["Maintenance", "Noise", "Safety", "Harassment", "Other"] },
  noticeCategories: { type: [String], default: ["General", "Maintenance", "Event", "Urgent"] },
  boardMemberDesignations: { type: [String], default: ["Chairperson", "Treasurer", "Secretary", "Member"] },
  locationAddress: { type: String, default: "HostelPro, 123 University Lane, College Town, USA 12345" },
  locationMapLink: { type: String, default: "https://maps.google.com/" },
}, { timestamps: true });

const SettingModel = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default SettingModel;
