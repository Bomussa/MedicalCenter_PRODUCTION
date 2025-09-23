import Audit from "../models/audit.js";
export const logAction = async (action, user="system", meta={}) => {
  try { await Audit.create({ action, user, meta }); } catch (e) { /* noop */ }
};
export const listLogs = async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await Audit.find({}).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ ok: true, logs });
  } catch (e) { res.status(500).json({ error: "audit list error" }); }
};
