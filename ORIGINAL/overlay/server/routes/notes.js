import express from "express";
import { createNote, listNotes, updateNote, deleteNote } from "../controllers/noteController.js";
const router = express.Router();
router.post("/", createNote);
router.get("/", listNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
export default router;
