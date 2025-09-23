import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: { type: Object, default: {} },
  },
  { timestamps: true }
);
const CMS = mongoose.models.CMS || mongoose.model('CMS', cmsSchema);

export async function getContent(req, res) {
  const doc = await CMS.findOne({ key: 'app' });
  res.json({ content: doc?.value || {} });
}

export async function updateContent(req, res) {
  const { value } = req.body || {};
  const doc = await CMS.findOneAndUpdate(
    { key: 'app' },
    { $set: { value: value || {} } },
    { upsert: true, new: true }
  );
  res.json({ content: doc.value });
}
