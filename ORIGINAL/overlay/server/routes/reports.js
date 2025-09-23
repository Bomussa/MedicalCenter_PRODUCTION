import express from "express";
import { exportCSV } from "../controllers/exportController.js";
const router = express.Router();
router.get("/export", exportCSV);
export default router;
