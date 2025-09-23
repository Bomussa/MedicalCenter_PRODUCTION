const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
  name_ar: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  pin: {
    type: String,
    required: false, // PIN can be optional or generated
  },
});

module.exports = mongoose.model('Clinic', ClinicSchema);

