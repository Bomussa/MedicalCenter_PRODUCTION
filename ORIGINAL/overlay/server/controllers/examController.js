import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    examinerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pin: { type: String, required: true },
    data: { type: Object, default: {} },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export async function startExam(req, res) {
  try {
    const { patientId, pin } = req.body || {};
    if (!patientId || !pin) {
      return res.status(400).json({ message: 'patientId و PIN مطلوبان' });
    }
    const exists = await Exam.findOne({ patientId, submittedAt: null });
    if (exists) return res.status(409).json({ message: 'يوجد فحص مفتوح لهذا المريض' });
    const exam = await Exam.create({
      patientId,
      examinerId: req.user.id,
      pin,
      data: {},
    });
    res.status(201).json({ id: exam._id });
  } catch (e) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
}

export async function submitExam(req, res) {
  try {
    const { id, data, pin } = req.body || {};
    if (!id || !pin) return res.status(400).json({ message: 'المعرف و PIN مطلوبان' });
    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ message: 'الفحص غير موجود' });
    if (exam.pin !== pin) return res.status(401).json({ message: 'PIN غير صحيح' });
    if (exam.submittedAt) return res.status(409).json({ message: 'تم إرسال الفحص سابقًا' });
    exam.data = data || {};
    exam.submittedAt = new Date();
    await exam.save();
    res.json({ message: 'تم الإرسال بنجاح' });
  } catch {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
}

export async function getExamById(req, res) {
  try {
    const ex = await Exam.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'الفحص غير موجود' });
    res.json({ exam: ex });
  } catch {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
}
