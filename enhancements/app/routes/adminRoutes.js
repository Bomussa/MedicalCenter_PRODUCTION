import express from 'express';
import { requireAuth, verifyRole } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings, getPins, getBackups, createBackup, restoreBackup, getErrorLogs } from '../controllers/adminController.js';

const router = express.Router();

// Apply general authentication for all admin routes
router.use(requireAuth);

// Specific roles for different actions
router.get('/settings', verifyRole('superAdmin'), getSettings);
router.post('/settings', verifyRole('superAdmin'), updateSettings);
router.get('/pins', verifyRole('superAdmin'), getPins);
router.get('/backups', verifyRole('superAdmin'), getBackups);
router.post('/backup', verifyRole('superAdmin'), createBackup);
router.post('/restore', verifyRole('superAdmin'), restoreBackup);
router.get('/logs/errors', verifyRole('superAdmin'), getErrorLogs);

export default router;


