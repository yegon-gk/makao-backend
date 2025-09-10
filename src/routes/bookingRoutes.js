// src/routes/bookingRoutes.js
import express from 'express';
import { createBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create', createBooking);

export default router;
