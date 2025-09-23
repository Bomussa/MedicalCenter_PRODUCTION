const Exam = require('../models/Exam');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const exams = await Exam.find().skip(skip).limit(limit);
    const totalExams = await Exam.countDocuments();
    res.json({ success: true, exams, totalPages: Math.ceil(totalExams / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('clinics.clinicId');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.byGender = async (req, res) => {
  try {
    const gender = req.params.gender;
    const exams = await Exam.find({ $or: [ { targetGender: gender }, { targetGender: 'both' } ] });
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name_ar, name_en, targetGender, clinicCount, clinics } = req.body;
    const newExam = new Exam({ name_ar, name_en, targetGender, clinicCount, clinics: clinics || [] });
    await newExam.save();
    res.status(201).json({ success: true, message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name_ar, name_en, targetGender, clinicCount, clinics } = req.body;
    const exam = await Exam.findByIdAndUpdate(req.params.id, { name_ar, name_en, targetGender, clinicCount, clinics }, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ success: true, message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
