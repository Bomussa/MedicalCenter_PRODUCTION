import express from "express";
import { runNow } from "../controllers/jobsController.js";
const router = express.Router();
router.post("/run", runNow);
export default router;
