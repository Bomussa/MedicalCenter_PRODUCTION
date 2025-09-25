import { Router } from "express";
import { login, createAdmin, listUsers, ensureSuperAdmin } from "../controllers/authController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();
ensureSuperAdmin();

router.post("/login", login);
router.post("/users", requireAuth, requireRole("SUPER_ADMIN"), createAdmin);
router.get("/users", requireAuth, requireRole("ADMIN"), listUsers);

export default router;
