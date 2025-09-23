import express from "express";
import { runTests } from "../controllers/adminTestsController.js";

const router = express.Router();

// تشغيل الاختبارات عند الطلب من واجهة الإدارة
router.post("/run-tests", runTests);

export default router;
