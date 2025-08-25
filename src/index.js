// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors'; // Handle async errors in routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev'));  // HTTP request logger

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Makao Backend API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
