import express from "express";
import { listLogs } from "../controllers/auditController.js";
const router = express.Router();
router.get("/logs", listLogs);
export default router;
