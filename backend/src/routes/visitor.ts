import { Router } from "express";
import { registerVisitor } from "../controllers/visitorController";
const router = Router();
router.post("/register", registerVisitor);
export default router;
