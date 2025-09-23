import { Router } from 'express';
import authRoutes from './auth.js';
import examRoutes from './exam.js';
import reportRoutes from './reports.js';
import cmsRoutes from './cms.js';
import analyticsRoutes from './analytics.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/exam', examRoutes);
router.use('/reports', reportRoutes);
router.use('/cms', cmsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
