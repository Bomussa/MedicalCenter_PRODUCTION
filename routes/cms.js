const router = require('express').Router();
const { requireRole } = require('../middleware/roles');

const configCtrl = require('../controllers/configController');
const textCtrl = require('../controllers/textController');
const iconCtrl = require('../controllers/iconController');
const pageCtrl = require('../controllers/pageController');
const routeCtrl = require('../controllers/routeController');

// AppConfig (key-value JSON)
router.get('/config', requireRole(['superAdmin','content_manager','admin']), configCtrl.getAll);
router.get('/config/:key', requireRole(['superAdmin','content_manager','admin']), configCtrl.getKey);
router.put('/config/:key', requireRole(['superAdmin','content_manager','admin']), configCtrl.setKey);
router.delete('/config/:key', requireRole(['superAdmin','admin']), configCtrl.deleteKey);

// Texts (bilingual)
router.get('/texts', requireRole(['superAdmin','content_manager','admin']), textCtrl.list);
router.get('/texts/:key', requireRole(['superAdmin','content_manager','admin']), textCtrl.get);
router.put('/texts/:key', requireRole(['superAdmin','content_manager','admin']), textCtrl.upsert);
router.delete('/texts/:key', requireRole(['superAdmin','admin']), textCtrl.remove);

// Icons
router.get('/icons', requireRole(['superAdmin','content_manager','admin']), iconCtrl.list);
router.get('/icons/:id', requireRole(['superAdmin','content_manager','admin']), iconCtrl.get);
router.put('/icons/:id', requireRole(['superAdmin','content_manager','admin']), iconCtrl.upsert);
router.delete('/icons/:id', requireRole(['superAdmin','admin']), iconCtrl.remove);

// Pages
router.get('/pages', requireRole(['superAdmin','content_manager','admin']), pageCtrl.list);
router.get('/pages/:id', requireRole(['superAdmin','content_manager','admin']), pageCtrl.get);
router.put('/pages/:id', requireRole(['superAdmin','content_manager','admin']), pageCtrl.upsert);
router.delete('/pages/:id', requireRole(['superAdmin','admin']), pageCtrl.remove);

// Routes
router.get('/routes', requireRole(['superAdmin','flow_manager','admin']), routeCtrl.list);

module.exports = router;
