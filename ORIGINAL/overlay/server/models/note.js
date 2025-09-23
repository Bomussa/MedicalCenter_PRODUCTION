import mongoose from "mongoose";
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, default: "system" },
}, { timestamps: true });
export default mongoose.model("Note", NoteSchema);
