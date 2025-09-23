const router = require('express').Router();
const ctrl = require('../controllers/visitController');
const { requireRole } = require('../middleware/roles');

// Public create
router.post('/', ctrl.createVisit);
// Per-clinic listing (no PII)
router.get('/clinic/:clinicId', ctrl.listByClinic);

// Admin CRUD & listing with decrypted IDs (protect in production)
router.get('/admin', requireRole(['superAdmin','admin','analytics']), ctrl.listAll);
router.post('/admin', requireRole(['superAdmin','admin']), ctrl.createVisit);
router.put('/:id', requireRole(['superAdmin','admin']), ctrl.updateVisit);
router.delete('/:id', requireRole(['superAdmin','admin']), ctrl.deleteVisit);

module.exports = router;
