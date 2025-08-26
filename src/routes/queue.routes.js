const router = require('express').Router();
const ctrl = require('../controllers/queue.controller');
const { requireAuth, requireRoles } = require('../middleware/auth');

router.post('/join', requireAuth, requireRoles('tenant', 'admin'), ctrl.join);

module.exports = router;
