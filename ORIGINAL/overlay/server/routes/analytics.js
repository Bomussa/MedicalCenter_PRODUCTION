import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.get('/overview', requireAuth, async (req, res) => {
  res.json({
    totals: { visits: 162, exams: 77 },
    byClinic: [{ clinic: 'General', visits: 120 }, { clinic: 'Dental', visits: 42 }],
  });
});
export default router;
