
import mongoose from "mongoose";

const utilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const UtilityModel = mongoose.models.Utility || mongoose.model("Utility", utilitySchema);

export default UtilityModel;
