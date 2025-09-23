import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getContent, updateContent } from '../controllers/cmsController.js';

const router = Router();
router.get('/content', requireAuth, getContent);
router.put('/content', requireAuth, updateContent);
export default router;
