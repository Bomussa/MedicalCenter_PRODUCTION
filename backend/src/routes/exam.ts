import { Router } from "express";
import { listExamTypes, setVisitorExam } from "../controllers/examController";
const router = Router();
router.get("/types", listExamTypes);
router.post("/set", setVisitorExam);
export default router;
