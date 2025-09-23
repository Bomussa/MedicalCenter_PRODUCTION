const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  name_ar: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  targetGender: {
    type: String,
    enum: ['male', 'female', 'both'],
    default: 'both',
  },
  clinicCount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  clinics: [
    {
      clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
      },
      order: Number,
    },
  ],
}, { timestamps: true });

// Pre-save hook to update clinicCount based on the length of the clinics array
ExamSchema.pre("save", function (next) {
  if (this.isModified("clinics")) {
    this.clinicCount = this.clinics.length;
  }
  next();
});

// Pre-findOneAndUpdate hook to update clinicCount based on the length of the clinics array
ExamSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.clinics) {
    update.clinicCount = update.clinics.length;
  }
  next();
});

module.exports = mongoose.model("Exam", ExamSchema);

