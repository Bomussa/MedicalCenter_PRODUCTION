import { Router } from "express";
import { getFeatureFlags, setFeatureFlag, listNotes, addNote, listNotifications, upsertNotification, listTodayPins, regenTodayPins, verifyPin, reportsCsv, statsOverview, reportsPreview } from "../controllers/adminController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/features", requireAuth, getFeatureFlags);
router.post("/features", requireAuth, requireRole("ADMIN"), setFeatureFlag);

router.get("/notes", requireAuth, listNotes);
router.post("/notes", requireAuth, requireRole("ADMIN"), addNote);

router.get("/notifications", requireAuth, listNotifications);
router.post("/notifications", requireAuth, requireRole("ADMIN"), upsertNotification);

router.get("/pins/today", requireAuth, listTodayPins);
router.post("/pins/regen", requireAuth, requireRole("ADMIN"), regenTodayPins);
router.post("/pins/verify", verifyPin); // verification can be public for clinic terminals

router.get("/reports/csv", requireAuth, reportsCsv);
router.get("/reports/preview", requireAuth, reportsPreview);
router.get("/stats/overview", requireAuth, statsOverview);

export default router;
