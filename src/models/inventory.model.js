import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Furniture', 'Appliance', 'Gym Equipment', 'Safety', 'Other'],
    required: true
  },
  location: { type: String, required: true, trim: true },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Used', 'Damaged'],
    default: 'Good'
  },
  status: {
    type: String,
    enum: ['In Stock', 'In Use', 'Under Repair'],
    default: 'In Stock'
  }
}, { timestamps: true });

const InventoryItemModel = mongoose.models.InventoryItem || mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItemModel;
