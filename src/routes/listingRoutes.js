// src/routes/listingRoutes.js
import express from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
} from '../controllers/listingController.js';

const router = express.Router();

router.post('/create', createListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;
