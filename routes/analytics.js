const router = require('express').Router();
const { getOverview, getMetrics } = require('../controllers/analyticsController');
const { requireRole } = require('../middleware/roles');

// Overview JSON for admin dashboard
router.get('/overview', requireRole(['superAdmin','analytics','content_manager','flow_manager']), getOverview);

// Prometheus text metrics (read-only; can be unauthenticated if behind firewall)
router.get('/metrics', getMetrics);

module.exports = router;
