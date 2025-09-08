import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  joinedAt: { type: Date, default: Date.now },
  avatar: { type: String, default: null }
}, { timestamps: true });

const BoardMemberModel = mongoose.models.BoardMember || mongoose.model("BoardMember", boardMemberSchema);

export default BoardMemberModel;
