const router = require('express').Router();
const ctrl = require('../controllers/payments.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/process', requireAuth, ctrl.process); // stub for now
router.post('/webhook', ctrl.webhook); // public webhook endpoint

module.exports = router;
