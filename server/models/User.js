import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    militaryId: { type: String, required: true, unique: true, index: true },
    pinHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'doctor', 'nurse'], default: 'staff' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.verifyPin = function (pin) {
  return bcrypt.compareSync(pin, this.pinHash);
};

export default mongoose.model('User', userSchema);
