const router = require('express').Router();
const ctrl = require('../controllers/properties.controller');
const { requireAuth, requireRoles } = require('../middleware/auth');

// Landing page
router.get('/featured', ctrl.getFeatured);
router.get('/suggestions', ctrl.getSuggestions);

// Search
router.post('/search', ctrl.search);

// Detail
router.get('/:id', ctrl.getById);

// Create (Lister/Landlord/Admin)
router.post(
  '/',
  requireAuth,
  requireRoles('lister', 'landlord', 'admin'),
  ctrl.create
);

module.exports = router;
