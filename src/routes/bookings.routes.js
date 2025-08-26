const router = require('express').Router();
const ctrl = require('../controllers/bookings.controller');
const { requireAuth, requireRoles } = require('../middleware/auth');

router.post('/create', requireAuth, requireRoles('tenant', 'admin'), ctrl.create);
router.get('/:id', requireAuth, ctrl.getById);

module.exports = router;
