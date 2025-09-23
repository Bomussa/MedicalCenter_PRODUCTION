import express from "express";
import { addVisit, getSummaryFromDB } from "../controllers/analyticsDBController.js";

const router = express.Router();

router.post("/add", addVisit);
router.get("/summary", getSummaryFromDB);

export default router;
