import express from "express";
import { listContent, addContent, updateContent } from "../controllers/cmsController.js";
import { checkRole } from "../middleware/checkRole.js";
const router = express.Router();
router.get("/content", listContent);
router.post("/content", checkRole("admin"), addContent);
router.put("/content/:id", checkRole("admin"), updateContent);
export default router;
