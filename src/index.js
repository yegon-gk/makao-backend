// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { register, login } from './controllers/authController.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import listingRoutes from './routes/listingRoutes.js'; // ✅ Import listings routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// ===== Health Check Route =====
app.get('/', (req, res) => {
  res.send('Makao Backend is running!');
});

// ===== Auth Routes =====
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// ===== Property Routes =====
app.use('/api/properties', propertyRoutes);

// ===== Listings Routes =====
app.use('/api/listings', listingRoutes); // ✅ New Listings Routes

// ===== Booking & Queue Routes =====
app.use('/api/bookings', bookingRoutes);
app.use('/api/queue', queueRoutes);

// ===== 404 Fallback =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
