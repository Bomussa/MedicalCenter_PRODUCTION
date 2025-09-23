import mongoose from "mongoose";
const AuditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, default: "system" },
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model("Audit", AuditSchema);
