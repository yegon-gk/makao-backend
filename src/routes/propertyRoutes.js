// src/routes/propertyRoutes.js
import { Router } from 'express';
import {
  getFeatured,
  getProperties,
  getSuggestions,
  search,
  getById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { requireAuth, requireRoles } from '../middlewares/auth.js';

const router = Router();

// ===== All properties =====
router.get('/', getProperties);

// ===== Landing Page =====
router.get('/featured', getFeatured);
router.get('/suggestions', getSuggestions);

// ===== Search =====
router.post('/search', search);

// ===== Detail =====
router.get('/:id', getById);

// ===== Create (Lister/Landlord/Admin only) =====
router.post(
  '/',
  requireAuth,
  requireRoles('lister', 'landlord', 'admin'),
  createProperty
);

// ===== Update (Owner or Admin) =====
router.put(
  '/:id',
  requireAuth,
  requireRoles('lister', 'landlord', 'admin'),
  updateProperty
);

// ===== Delete (Admin only) =====
router.delete('/:id', requireAuth, requireRoles('admin'), deleteProperty);

export default router;
