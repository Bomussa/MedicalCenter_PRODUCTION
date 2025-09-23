import Note from "../models/note.js";
import { logAction } from "../controllers/auditController.js";

export const createNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    await logAction('note:create', 'system', { id: note._id });
    await logAction('note:update', 'system', { id: note?._id || req.params.id });
    res.json({ ok: true, note });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const listNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({ ok: true, notes });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: "Note not found" });
    await logAction('note:create', 'system', { id: note._id });
    res.json({ ok: true, note });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    await logAction('note:delete', 'system', { id: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
