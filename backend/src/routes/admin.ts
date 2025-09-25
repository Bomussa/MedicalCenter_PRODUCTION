import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getDashboardStats,
  getCsvReport,
  getReportPreviewData,
  getAnalyticsData,
  getDailyCodes,
  generateNewCodes,
  getAuditLogs
} from '../controllers/adminController'

const router = Router()

// All admin routes require authentication
router.use(requireAuth)

// Dashboard stats (accessible by ADMIN and above)
router.get('/dashboard/stats', requireRole('ADMIN'), getDashboardStats)

// Reports (accessible by ADMIN and above)
router.get('/reports/csv', requireRole('ADMIN'), getCsvReport)
router.get('/reports/preview', requireRole('ADMIN'), getReportPreviewData)

// Analytics (accessible by ADMIN and above)
router.get('/analytics', requireRole('ADMIN'), getAnalyticsData)

// Daily codes (accessible by ADMIN and above)
router.get('/codes', requireRole('ADMIN'), getDailyCodes)
router.post('/codes/generate', requireRole('ADMIN'), generateNewCodes)

// Audit logs (accessible by SUPER_ADMIN only)
router.get('/audit-logs', requireRole('SUPER_ADMIN'), getAuditLogs)

export default router

