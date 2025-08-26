// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { register, login } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // parse JSON bodies

// ===== Routes =====

// Health check
app.get('/', (req, res) => {
  res.send('Makao Backend is running!');
});

// Auth routes
app.post('/api/auth/register', register);  // <- Register new user
app.post('/api/auth/login', login);        // <- Login user

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
