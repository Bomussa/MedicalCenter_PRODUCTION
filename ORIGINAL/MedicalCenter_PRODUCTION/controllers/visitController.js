const { Visit } = require('../models');
const { encrypt, decrypt } = require('../utils/crypto');

exports.createVisit = async (req, res, next) => {
  try {
    const { militaryId, gender, examId, clinicId, startTime, endTime, status } = req.body;
    const v = await Visit.create({
      militaryIdEnc: encrypt(militaryId),
      gender, examId, clinicId, status: status || 'queued',
      startTime: startTime || null,
      endTime: endTime || null
    });
    res.status(201).json({ id: v.id });
  } catch (e) { next(e); }
};

exports.updateVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { militaryId, gender, examId, clinicId, status, startTime, endTime } = req.body;
    const patch = {};
    if (militaryId) patch.militaryIdEnc = encrypt(militaryId);
    if (typeof gender !== 'undefined') patch.gender = gender;
    if (typeof examId !== 'undefined') patch.examId = examId;
    if (typeof clinicId !== 'undefined') patch.clinicId = clinicId;
    if (typeof status !== 'undefined') patch.status = status;
    if (typeof startTime !== 'undefined') patch.startTime = startTime;
    if (typeof endTime !== 'undefined') patch.endTime = endTime;
    const [n] = await Visit.update(patch, { where: { id } });
    if (!n) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.deleteVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const n = await Visit.destroy({ where: { id } });
    if (!n) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (e) { next(e); }
};

exports.listByClinic = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const rows = await Visit.findAll({ where: { clinicId }, limit: 500, order: [['createdAt','DESC']] });
    res.json(rows.map(r => ({
      id: r.id,
      gender: r.gender,
      examId: r.examId,
      status: r.status,
      startTime: r.startTime,
      endTime: r.endTime,
      createdAt: r.createdAt
    })));
  } catch (e) { next(e); }
};

exports.listAll = async (req, res, next) => {
  try {
    const rows = await Visit.findAll({ limit: 2000, order: [['createdAt','DESC']] });
    res.json(rows.map(r => ({
      id: r.id,
      militaryId: r.militaryIdEnc ? decrypt(r.militaryIdEnc) : null,
      gender: r.gender,
      examId: r.examId,
      clinicId: r.clinicId,
      status: r.status,
      startTime: r.startTime,
      endTime: r.endTime,
      createdAt: r.createdAt
    })));
  } catch (e) { next(e); }
};
