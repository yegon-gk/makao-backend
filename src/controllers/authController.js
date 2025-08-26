// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js'; // Use single Prisma client instance

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Corrected: include role

    if (!username || !email || !password || !role) {      // Corrected: role is required
      return res.status(400).json({ message: 'All fields are required' });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Corrected: hash before storing

    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,       // Corrected: matches Prisma model
        email: trimmedEmail,
        password_hash: hashedPassword,   // Corrected: field name must be password_hash
        role,                            // Corrected: required field
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash); // Corrected: password_hash

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role }, // Corrected: include role
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
