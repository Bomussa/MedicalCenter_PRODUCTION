const Clinic = require('../models/Clinic');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const clinics = await Clinic.find().select('-pin').skip(skip).limit(limit);
    const totalClinics = await Clinic.countDocuments();
    res.json({ clinics, totalPages: Math.ceil(totalClinics / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).select('-pin');
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name_ar, name_en, floor, order, pin } = req.body;
    const newClinic = new Clinic({ name_ar, name_en, floor, order, pin });
    await newClinic.save();
    res.status(201).json({ success: true, message: 'Clinic created successfully', clinic: newClinic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name_ar, name_en, floor, order, pin, isActive } = req.body;
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, { name_ar, name_en, floor, order, pin, isActive }, { new: true });
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ success: true, message: 'Clinic updated successfully', clinic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
