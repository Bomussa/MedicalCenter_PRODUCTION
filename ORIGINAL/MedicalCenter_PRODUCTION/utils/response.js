const ok = (res, data) => res.json({ success: true, ...data });
const created = (res, data) => res.status(201).json({ success: true, ...data });

module.exports = { ok, created };
