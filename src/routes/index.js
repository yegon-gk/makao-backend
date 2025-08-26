const router = require('express').Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

router.use('/auth', require('./auth.routes'));
router.use('/properties', require('./properties.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/queue', require('./queue.routes'));
router.use('/payments', require('./payments.routes'));
router.use('/issues', require('./issues.routes'));

module.exports = router;
