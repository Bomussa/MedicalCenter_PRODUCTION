const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../services/jwtService');
const { generateSecret, verifyToken: verify2FA } = require('../services/twoFactorService');

const sanitizeUser = (u) => u ? ({
  id: u._id,
  username: u.username,
  role: u.role,
  isActive: u.isActive,
  isTwoFactorEnabled: u.isTwoFactorEnabled,
  createdAt: u.createdAt
}) : null;

exports.login = async (req, res) => {
  try {
    const { username, password, twoFactorCode, twoFA } = req.body;
  const twoFactorInput = twoFactorCode || twoFA;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'User is inactive' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.isTwoFactorEnabled) {
      const providedToken = twoFactorInput;
      if (!twoFactorCode) return res.status(400).json({ message: '2FA required' });
      const verified = verify2FA(user.twoFactorSecret, twoFactorCode);
      if (!verified) return res.status(400).json({ message: 'Invalid 2FA code' });
    }
    const token = sign({ userId: user._id, username: user.username, role: user.role });
    return res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const users = await User.find().select('-password -twoFactorSecret');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashed, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: sanitizeUser(newUser) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.patchStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password -twoFactorSecret');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.twofaGenerate = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const secret = generateSecret('AttarMedical');
    user.twoFactorSecret = secret.base32;
    user.isTwoFactorEnabled = false;
    await user.save();
    res.json({ base32: secret.base32, otpauth_url: secret.otpauth_url });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.twofaEnable = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user || !user.twoFactorSecret) return res.status(400).json({ message: '2FA is not set up' });
    const verified = verify2FA(user.twoFactorSecret, token);
    if (!verified) return res.status(400).json({ message: 'Invalid 2FA token' });
    user.isTwoFactorEnabled = true;
    await user.save();
    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.twofaDisable = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
