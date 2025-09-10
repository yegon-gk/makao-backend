// routes/queueRoutes.js
import express from 'express';
import { joinQueue } from '../controllers/queueController.js';

const router = express.Router();

// Queue route
router.post('/join', joinQueue);

export default router;  // ✅ Default export
