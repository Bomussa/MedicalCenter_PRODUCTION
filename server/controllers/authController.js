import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { militaryId, pin } = req.body || {};
    if (!militaryId || !pin) {
      return res.status(400).json({ message: 'رقم العسكري و PIN مطلوبان' });
    }
    const user = await User.findOne({ militaryId, active: true }).lean();
    if (!user) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    // نحتاج user كامل لاستخدام methods => جلب مرة ثانية
    const u = await User.findOne({ _id: user._id });
    const ok = u.verifyPin(pin);
    if (!ok) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pinHash');
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'تم تسجيل الخروج' });
};
