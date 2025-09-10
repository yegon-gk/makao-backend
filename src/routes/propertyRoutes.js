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
import { requireAuth } from '../middlewares/auth.js';

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

// ===== Create (Any logged-in user can create) =====
router.post('/', requireAuth, createProperty);

// ===== Update (Any logged-in user can update) =====
router.put('/:id', requireAuth, updateProperty);

// ===== Delete (Still restricted to Admin) =====
router.delete('/:id', requireAuth, deleteProperty);

export default router;
