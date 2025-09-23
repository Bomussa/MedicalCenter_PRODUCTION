import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { exportCsv, exportPdf } from '../controllers/reportController.js';

const router = Router();
router.get('/csv', requireAuth, exportCsv);
router.get('/pdf', requireAuth, exportPdf);
export default router;
