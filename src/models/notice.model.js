import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  publishedAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['Maintenance', 'Event', 'General', 'Urgent'],
    default: 'General',
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const NoticeModel = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);

export default NoticeModel;
