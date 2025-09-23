import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
  {
    examType: { type: String, required: true },
    gender: { type: String, enum: ["ذكر", "أنثى"], required: true },
    visitDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", VisitSchema);
