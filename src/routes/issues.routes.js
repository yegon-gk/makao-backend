const router = require('express').Router();
const ctrl = require('../controllers/issues.controller');
const { requireAuth, requireRoles } = require('../middleware/auth');

router.post('/report', requireAuth, requireRoles('tenant', 'lister', 'admin'), ctrl.report);

module.exports = router;
