import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { startExam, submitExam, getExamById } from '../controllers/examController.js';

const router = Router();
router.post('/start', requireAuth, startExam);
router.post('/submit', requireAuth, submitExam);
router.get('/:id', requireAuth, getExamById);
export default router;
