
import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const GalleryImageModel = mongoose.models.GalleryImage || mongoose.model("GalleryImage", galleryImageSchema);

export default GalleryImageModel;
